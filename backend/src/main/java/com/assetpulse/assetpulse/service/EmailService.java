package com.assetpulse.assetpulse.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${spring.mail.host}")
    private String host;

    @Value("${spring.mail.port}")
    private String port;

    @PostConstruct
    public void test() {
        System.out.println("MAIL HOST = " + host);
        System.out.println("MAIL PORT = " + port);
        System.out.println("MAIL FROM = " + fromEmail);
    }

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendInviteEmail(String toEmail, String inviteLink) {

        SimpleMailMessage message = new SimpleMailMessage();



        message.setFrom(fromEmail);
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

    public void sendResetPasswordEmail(
            String toEmail,
            String resetLink
    ) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);

        message.setSubject("AssetPulse - Reset Your Password");

        message.setText(
                "We received a request to reset your password.\n\n" +
                        "Click the link below to reset your password:\n\n" +
                        resetLink + "\n\n" +
                        "This link expires in 30 minutes.\n\n" +
                        "If you did not request this, please ignore this email.\n\n" +
                        "Regards,\nAssetPulse Team"
        );

        mailSender.send(message);
    }
}