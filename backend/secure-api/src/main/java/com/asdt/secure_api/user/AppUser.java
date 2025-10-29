    package com.asdt.secure_api.user;

    import jakarta.persistence.*;
    import lombok.*;
    import org.hibernate.annotations.CreationTimestamp;

    import java.time.Instant;

    @Entity
    @Table(name = "users")
    @Setter
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public class AppUser {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(nullable = false, unique = true, length = 100)
        private String username;

        @Column(nullable = false, unique = true, length = 100)
        private String passwordHash;

        public enum Role {USER,ADMIN}
        @Enumerated(EnumType.STRING)
        @Column(length = 20,nullable = false)
        private Role role = Role.USER;

        @CreationTimestamp
        @Column(name = "create_at", nullable = false, updatable = false)
        private Instant createAt;

    }
