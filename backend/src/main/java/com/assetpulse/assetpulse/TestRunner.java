package com.assetpulse.assetpulse;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.net.InetSocketAddress;
import java.net.Socket;

@Component
public class TestRunner implements CommandLineRunner {

    @Override
    public void run(String... args) {

        try {
            System.out.println("===== SMTP TEST START =====");

            Socket socket = new Socket();
            socket.connect(new InetSocketAddress("smtp.gmail.com", 587), 10000);

            System.out.println("SUCCESS: Connected to smtp.gmail.com:587");

            socket.close();

        } catch (Exception e) {

            System.out.println("FAILED TO CONNECT");

            e.printStackTrace();

        }

        System.out.println("===== SMTP TEST END =====");
    }
}