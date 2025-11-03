package com.asdt.secure_api.config;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;

class PasswordEncoderBeanTest {

    private final ApplicationContextRunner contextRunner =
            new ApplicationContextRunner().withUserConfiguration(BeansConfig.class);

    @Test
    void passwordEncoder_encodes_and_matches() {
        contextRunner.run(ctx -> {
            PasswordEncoder pe = ctx.getBean(PasswordEncoder.class);
            String raw = "secret123";
            String enc = pe.encode(raw);

            assertThat(enc).isNotBlank();
            assertThat(pe.matches(raw, enc)).isTrue();
            assertThat(pe.matches("wrong", enc)).isFalse();
        });
    }
}
