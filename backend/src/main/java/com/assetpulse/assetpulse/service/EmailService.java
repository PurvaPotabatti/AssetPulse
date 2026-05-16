package com.assetpulse.assetpulse.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendInviteEmail(String toEmail, String inviteLink) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("AssetPulse - Setup Your Account");

        message.setText(
                "Welcome to AssetPulse!\n\n" +
                        "Click the link below to set your password:\n\n" +
                        inviteLink + "\n\n" +
                        "This link expires in 7 days.\n\n" +
                        "Regards,\nAssetPulse Team"
        );

        mailSender.send(message);
    }
}