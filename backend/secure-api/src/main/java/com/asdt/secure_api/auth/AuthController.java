package com.asdt.secure_api.auth;

import com.asdt.secure_api.auth.dto.AuthResponse;
import com.asdt.secure_api.auth.dto.LoginRequest;
import com.asdt.secure_api.user.AppUser;
import com.asdt.secure_api.user.AppUserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

import static com.asdt.secure_api.user.AppUser.Role.USER;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AppUserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwt;

    public AuthController(AppUserRepository users, PasswordEncoder passwordEncoder, JwtService jwt) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.jwt = jwt;
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@Valid @RequestBody LoginRequest req){
        Optional<AppUser> found = users.findByUsername(req.username());
        System.out.println(">>> /signin called for user = " + req.username());

        if (found.isEmpty()){
            return ResponseEntity.status(401).body("Bad credentials");
        }
        AppUser u = found.get();
        if (!passwordEncoder.matches(req.password(), u.getPasswordHash())){
            return  ResponseEntity.status(401).body("Bad credentials");
        }
        String token = jwt.generateToken(u.getUsername());
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/_dev_signup_once")
    public ResponseEntity<?> devSignUpOnce(@RequestParam String username, @RequestParam String password){
        if (users.findByUsername(username).isPresent()){
            return ResponseEntity.badRequest().body("Username already exists");
        }
        AppUser u = new AppUser();
        u.setUsername(username);
        u.setPasswordHash(passwordEncoder.encode(password));
        u.setRole(USER);
        users.save(u);
        return ResponseEntity.ok("Dev user created");

    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody LoginRequest req) {
        if (users.findByUsername(req.username()).isPresent()) {
            return ResponseEntity.status(409).body("Username already exists.");
        }
        AppUser u = new AppUser();
        u.setUsername(req.username());
        u.setPasswordHash(passwordEncoder.encode(req.password())); // hash it
        u.setRole(USER);
        users.save(u);
        return ResponseEntity.status(201).body("Account created");
    }

}
