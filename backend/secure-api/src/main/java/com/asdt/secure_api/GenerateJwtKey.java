package com.asdt.secure_api;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.util.Base64;

public class GenerateJwtKey {
    public static void main(String[] args) {
        var key = Keys.secretKeyFor(SignatureAlgorithm.HS256); // 256-bit key
        String base64 = Base64.getEncoder().encodeToString(key.getEncoded());
        System.out.println(base64);
    }
}
