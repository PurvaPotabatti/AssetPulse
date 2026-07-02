package com.assetpulse.assetpulse.controller;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/test-mail")
    public String testMail(JavaMailSender sender) {

        SimpleMailMessage msg = new SimpleMailMessage();

        msg.setTo("YOUR_GMAIL@gmail.com");
        msg.setSubject("Test");
        msg.setText("Hello");

        sender.send(msg);

        return "Mail Sent";
    }
}