package com.asdt.secure_api.auth;

import com.asdt.secure_api.config.SecurityConfig;
import com.asdt.secure_api.user.AppUser;
import com.asdt.secure_api.user.AppUserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatcher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.AutoConfigureJsonTesters;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.Optional;

import static com.asdt.secure_api.user.AppUser.Role.USER;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureJsonTesters
@Import(SecurityConfig.class) // use your real security (permitAll on /api/auth/**)
@ActiveProfiles("test")
class AuthControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    AppUserRepository users;

    @MockitoBean
    PasswordEncoder passwordEncoder;

    @MockitoBean
    JwtService jwtService;

    @Test
    @DisplayName("POST /api/auth/signin -> 200 + token (valid user & password)")
    void signin_success_returns_token() throws Exception {
        AppUser u = new AppUser();
        u.setUsername("alice");
        u.setPasswordHash("ENCODED");
        u.setRole(USER);

        when(users.findByUsername("alice")).thenReturn(Optional.of(u));
        when(passwordEncoder.matches("pw123", "ENCODED")).thenReturn(true);
        when(jwtService.generateToken("alice")).thenReturn("test.jwt.token");

        mockMvc.perform(
                        post("/api/auth/signin")
                                .with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                {"username":"alice","password":"pw123"}
                                """)
                )
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.token").value("test.jwt.token"));

        verify(users).findByUsername("alice");
        verify(passwordEncoder).matches("pw123", "ENCODED");
        verify(jwtService).generateToken("alice");
    }

    @Test
    @DisplayName("POST /api/auth/signin -> 401 when user not found")
    void signin_unknown_user_returns_401() throws Exception {
        when(users.findByUsername("ghost")).thenReturn(Optional.empty());

        mockMvc.perform(
                        post("/api/auth/signin")
                                .with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                {"username":"ghost","password":"whatever"}
                                """)
                )
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Bad credentials"));

        verify(users).findByUsername("ghost");
        verifyNoMoreInteractions(passwordEncoder, jwtService);
    }

    @Test
    @DisplayName("POST /api/auth/signin -> 401 when password mismatch")
    void signin_wrong_password_returns_401() throws Exception {
        AppUser u = new AppUser();
        u.setUsername("alice");
        u.setPasswordHash("ENCODED");
        u.setRole(USER);

        when(users.findByUsername("alice")).thenReturn(Optional.of(u));
        when(passwordEncoder.matches("wrong", "ENCODED")).thenReturn(false);

        mockMvc.perform(
                        post("/api/auth/signin")
                                .with(csrf())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                {"username":"alice","password":"wrong"}
                                """)
                )
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Bad credentials"));
    }

    @Test
    @DisplayName("POST /api/auth/signin -> 400 for invalid payload (bean validation)")
    void signin_invalid_payload_returns_400() throws Exception {
        // username blank triggers @NotBlank
        mockMvc.perform(
                post("/api/auth/signin")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"username":"","password":"x"}
                                """)
        ).andExpect(status().isBadRequest());

        // missing fields also 400
        mockMvc.perform(
                post("/api/auth/signin")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}")
        ).andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/auth/_dev_signup_once -> 200 creates user if not exists")
    void dev_signup_once_creates_user() throws Exception {
        when(users.findByUsername("bob")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("secret")).thenReturn("HASH");

        mockMvc.perform(
                        post("/api/auth/_dev_signup_once")
                                .with(csrf())
                                .param("username", "bob")
                                .param("password", "secret")
                )
                .andExpect(status().isOk())
                .andExpect(content().string("Dev user created"));

        verify(users).save(argThat((AppUser saved) ->
                "bob".equals(saved.getUsername())
                        && "HASH".equals(saved.getPasswordHash())
                        && saved.getRole() == USER
        ));
    }

    @Test
    @DisplayName("POST /api/auth/_dev_signup_once -> 400 if username taken")
    void dev_signup_once_duplicate_username() throws Exception {
        AppUser existing = new AppUser();
        existing.setUsername("alice");
        when(users.findByUsername("alice")).thenReturn(Optional.of(existing));

        mockMvc.perform(
                        post("/api/auth/_dev_signup_once")
                                .with(csrf())
                                .param("username", "alice")
                                .param("password", "pw")
                )
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Username already exists"));

        verify(users, never()).save(any());
    }
}
