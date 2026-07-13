package com.assetpulse.assetpulse;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.net.InetSocketAddress;
import java.net.Socket;

@Component
public class TestRunner implements CommandLineRunner {

    @Override
    public void run(String... args) {

        System.out.println("===== NETWORK TEST START =====");

        testConnection("google.com", 443);

        testConnection("smtp.gmail.com", 587);

        testConnection("smtp.gmail.com", 465);

        System.out.println("===== NETWORK TEST END =====");
    }

    private void testConnection(String host, int port) {

        try (Socket socket = new Socket()) {

            socket.connect(new InetSocketAddress(host, port), 10000);

            System.out.println("SUCCESS -> " + host + ":" + port);

        } catch (Exception e) {

            System.out.println("FAILED -> " + host + ":" + port);

            e.printStackTrace();
        }
    }
}