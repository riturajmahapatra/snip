// buisness logic
package com.rituraj.system;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service //buisness logic of the application (Brains)
public class UrlService {

    private final UrlRepository repository; //final - no changes,

    public UrlService(UrlRepository repository) { //constructor made to ensure that a new object is propoerly inintalized
        this.repository = repository;
    }

    // Generate short ID
    private String generateId() {
        String chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder();
        Random random = new Random();

        for (int i = 0; i < 6; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }

        return sb.toString();
    }
//taken from the user
    public String createShortUrl(String originalUrl) {
        String id = generateId();

        Url url = new Url();
        url.setId(id);
        url.setOriginalUrl(originalUrl);
        url.setCreatedAt(LocalDateTime.now());

        repository.save(url);//insert query --save

        return "https://snip-rmkk.onrender.com/" + id;
    }

    public Optional<Url> getOriginalUrl(String id) {
        return repository.findById(id);
    }
}