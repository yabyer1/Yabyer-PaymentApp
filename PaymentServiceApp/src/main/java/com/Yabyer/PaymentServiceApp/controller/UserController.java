package com.Yabyer.PaymentServiceApp.controller;

import com.Yabyer.PaymentServiceApp.model.User;
import com.Yabyer.PaymentServiceApp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.concurrent.CountDownLatch;
@CrossOrigin()
@RestController
@RequestMapping("/user")
public class UserController {
    // private static Map<Integer, User> IdKey = new HashMap<>();
    private static Map<Integer, HashMap<Integer, Integer>> UserQueryMap = new HashMap<>();
    private final Object lock = new Object(); // Lock for synchronization
    private final CountDownLatch paymentLatch = new CountDownLatch(1);
    @Autowired
    private UserService userService;
    @PostMapping("/api/authenticate")
    public ResponseEntity<Map<String, Object>> AuthenticateUser(@RequestBody Map<String,String> request){
        String username = request.get("username");
        String password = request.get("password");
        for(User x: userService.getAllUsers()){
            if(x.getUsername().equals(username) && x.getPassword().equals(password)){
                Map<String, Object> userInfo = new HashMap<>();
                userInfo.put("id", x.getId());

                // You may choose not to include the password in the response for security reasons

                return ResponseEntity.ok(userInfo);
            }
        }
        return ResponseEntity.notFound().build(); //error
    }

    @PostMapping("/add")
    public String add(@RequestBody User user) {
        userService.saveUser(user);
        UserQueryMap.put(user.getId(), new HashMap<>());
        // IdKey.put(user.getId(), user);
        return "New User is added";
    }
    @GetMapping("/{id}/info")
    public ResponseEntity<Map<String, Object>> sendInfo(@PathVariable int id) {
        User user = userService.get(id);
        //System.out.println(id);
        //  System.out.println("GETTING" + " " + user.getId() + " " + user.getName());
        if (user != null) {
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", user.getId());
            userInfo.put("name", user.getName());
            userInfo.put("balance", user.getBalance());
            userInfo.put("username", user.getUsername());
            //  userInfo.put("queries", user.queries);
            // You may choose not to include the password in the response for security reasons

            return ResponseEntity.ok(userInfo);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @GetMapping("/getAll")
    public List<User> getAllUsers(){
        return userService.getAllUsers();
    }
    @PatchMapping("/balance/{id}")
    public String adjustBalance(
            @PathVariable("id") int id,
            @RequestParam("operation") String operation,
            @RequestParam("amount") int newAmnt
    ) {
        User x = userService.get(id);

        if ("add".equals(operation)) {
            if (newAmnt < 1) {
                return "To Little Requested";
            }
            userService.get(id).setBalance(x.getBalance() + newAmnt);
            userService.saveUser(userService.get(id));
            //  System.out.println(userService.get(id).getBalance());
            //   IdKey.put(id,userService.get(id));
            return "Balance Adjusted";
        } else if ("subtract".equals(operation)) {
            if (newAmnt < 1 || x.getBalance() < newAmnt) {
                return "Not Enough Funds";
            }
            userService.get(id).setBalance(x.getBalance() - newAmnt);
            userService.saveUser(userService.get(id));
            //   IdKey.put(id,userService.get(id));
            //  System.out.println( userService.get(id).getBalance());
            return "Balance Adjusted!";
        }
        return "Incorrect Command";
    }
    @PatchMapping("/{id}/PayQuery")
    public String PayRequest(@PathVariable("id") int fromID,
                             @RequestParam("amount") int amount,
                             @RequestParam("toID") int toID) {
        if (amount < 1 || amount > userService.get(fromID).getBalance()) {
            return "Request Invalid";
        }

        User toUser = userService.get(toID); // Retrieve user directly
        toUser.addQuery(fromID,amount);
        // toUser.queries.add(x); // Modify the user directly
        userService.saveUser(toUser); // Save the user directly
        HashMap<Integer, Integer> hm = UserQueryMap.get(toID);
        hm.put(fromID, amount);
        for(Map.Entry<Integer, Integer> z : hm.entrySet()){
            System.out.print(z.getKey() + " " + z.getValue() + "        ");
        }
        System.out.println();
        return "Request Successful";
    }

    @GetMapping("/{id}/pending-requests")
    @ResponseBody
    public List<Map<String, Object>> getPendingRequests(@PathVariable("id") int userId) {
        //   Map<Integer,Integer> queries = userService.get(userId).getQueries(); //Instead
        HashMap<Integer, Integer> queries = UserQueryMap.get(userId);
        //System.out.println("here");
        // Convert int[] to Map<String, Object>
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<Integer,Integer> x : queries.entrySet()) {
            //System.out.println(query[0] + " " + query[1]);
            Map<String, Object> queryMap = new HashMap<>();
            queryMap.put("userId", x.getKey());
            queryMap.put("amount", x.getValue());
            result.add(queryMap);
        }

        return result;
    }


    @PatchMapping("/{id}/Handler/{requesterID}/{decision}")
    public String HandleRequest(@PathVariable("id") int fromID, @PathVariable("requesterID") Integer toID, @PathVariable("decision") String decision){
        System.out.println("fromID " + fromID + " toID  " + toID + "Decision  " + decision);
        User Requester = userService.get(toID);
        User Recepient = userService.get(fromID);
        HashMap<Integer, Integer> hm = UserQueryMap.get(fromID);
        hm.remove(toID);
        int amnt = Recepient.getQuery(toID);
        if(decision.equals("accept")){
            Requester.setBalance(Requester.getBalance() + amnt);
            Recepient.setBalance(Recepient.getBalance() - amnt);
            userService.saveUser(userService.get(toID));
            userService.saveUser(userService.get(fromID));
            //  IdKey.put(fromID, Recepient);
            //  IdKey.put(toID, Requester);
            return "Request Successful";
        }
        return "Request Unssuccessul";
    }

    /*
    @PatchMapping("/{id}/PayQuery")
    public String PayRequest(
            @PathVariable("id") int fromID,
            @RequestParam("amount") int amount,
            @RequestParam("toID") int toID
    ) {
        User requester = userService.get(fromID);
        User recipient = userService.get(toID);


        if (amount > (2 * requester.getBalance()) || amount < 1) {
            return "Not Enough Balance to request Transaction";
        }
        System.out.println("Sending the request from " + fromID + "  to " + toID);
        PaymentRequestThread paymentThread = new PaymentRequestThread( toID, requester,  amount, recipient);
        paymentThread.start();
        try {
           paymentLatch.await();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        paymentLatch.countDown();
        return "Request Sent";

    }

    public boolean SendRequest(int target, User requester, int amount) {
           // return true;

        if (amount >= requester.getBalance()) {
            return false;
        }

        User recepient = userService.get(target);
        recepient.setQueried(true);
        userService.saveUser(recepient);
        AcceptanceThread accThread = new AcceptanceThread( target, requester,  amount, recepient);
        accThread.start();
        try {
            accThread.join(); // Wait for AcceptanceThread to complete
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        return accThread.decision;


    }
@PatchMapping("/{id}/handle-request")
    private boolean sendRequestToTarget(@RequestParam("ToID") int targetID, User requester, int amount, @RequestParam("decision") String Decision) {
        System.out.println("Received");
        User TargetUser = userService.get(targetID);
        if(TargetUser.isQueried()) {
            if ("accept".equals(Decision) && TargetUser.getBalance() >= amount) {
                return true;
            }
            return false;
        }
        else {
            System.out.println("No Requests");
            return false;
        }
    }
    private class AcceptanceThread extends Thread {
        private final int targetID;
        private final User requester;
        private final int amount;

        private final User recipient;
        private boolean decision;
        public AcceptanceThread(int targetID, User r1, int amount, User r2) {
            this.targetID = targetID;
            this.requester = r1;
            this.amount = amount;
            this.recipient = r2;
        }

        @Override
        public void run() {
            decision = sendRequestToTarget(targetID, requester, amount, "");

        }
    }

    private class PaymentRequestThread extends Thread {
        private final int targetID;
        private final User requester;
        private final int amount;

        private final User recipient;
        public PaymentRequestThread(int targetID, User r1, int amount, User r2) {
            this.targetID = targetID;
            this.requester = r1;
            this.amount = amount;
            this.recipient = r2;
        }

        @Override
        public void run() {
            boolean requestSentSuccessfully = SendRequest(targetID, requester, amount);
            if (requestSentSuccessfully) {
                synchronized (lock){
                    recipient.setBalance(recipient.getBalance() - amount);
                    requester.setBalance(requester.getBalance() + amount);
                    userService.saveUser(requester);
                    userService.saveUser(recipient);
                    System.out.println("Payment Successful!");
                     }
                } else {
                    System.out.println( "Payment Unsuccessful, Target was unable to complete transaction");
                }
            if(recipient.isQueried()){
                synchronized (lock) {
                    recipient.setQueried(false);
                    userService.saveUser(recipient);
                }
            }
            paymentLatch.countDown();
            }
        }

     */
}


