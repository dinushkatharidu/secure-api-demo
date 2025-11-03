package com.asdt.secure_api.user;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static com.asdt.secure_api.user.AppUser.Role.USER;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DataJpaTest
@ActiveProfiles("test")
class AppUserRepositoryTest {

    @Autowired
    AppUserRepository repo;

    @Test
    void save_and_findByUsername() {
        AppUser u = AppUser.builder()
                .username("alice")
                .passwordHash("hash")
                .role(USER)
                .build();

        AppUser saved = repo.save(u);
        assertThat(saved.getId()).isNotNull();

        Optional<AppUser> found = repo.findByUsername("alice");
        assertThat(found).isPresent();
        assertThat(found.get().getUsername()).isEqualTo("alice");
    }

    @Test
    void unique_username_constraint_enforced() {
        AppUser u1 = AppUser.builder().username("dup").passwordHash("h1").role(USER).build();
        AppUser u2 = AppUser.builder().username("dup").passwordHash("h2").role(USER).build();

        repo.saveAndFlush(u1);
        assertThatThrownBy(() -> repo.saveAndFlush(u2))
                .isInstanceOf(DataIntegrityViolationException.class);
    }
}
