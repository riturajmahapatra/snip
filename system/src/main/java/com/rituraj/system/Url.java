//db representatoive -schema type

package com.rituraj.system;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import java.time.LocalDateTime;

@Entity // means table linking to db
public class Url { //Url -- table name & class

    @Id // primary key that is unique
    private String id;  // short_id

    private String originalUrl;

    private LocalDateTime createdAt;

    // ===== Getters =====
    public String getId() { // fetch id
        return id;
    }

    public String getOriginalUrl() {
        return originalUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // ===== Setters =====
    public void setId(String id) { // set id
        this.id = id;
    }

    public void setOriginalUrl(String originalUrl) {
        this.originalUrl = originalUrl;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}