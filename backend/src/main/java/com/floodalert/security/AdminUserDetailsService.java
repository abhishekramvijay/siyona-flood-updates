package com.floodalert.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Backs Spring Security with the single preconfigured admin account defined
 * in application.properties (app.admin.username / app.admin.password-hash).
 * No admin user table is needed since exactly one admin account exists.
 */
@Service
public class AdminUserDetailsService implements UserDetailsService {

    private final String adminUsername;
    private final String adminPasswordHash;

    public AdminUserDetailsService(@Value("${app.admin.username}") String adminUsername,
                                    @Value("${app.admin.password-hash}") String adminPasswordHash) {
        this.adminUsername = adminUsername;
        this.adminPasswordHash = adminPasswordHash;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        if (!adminUsername.equalsIgnoreCase(username)) {
            throw new UsernameNotFoundException("Unknown admin user: " + username);
        }

        return new User(adminUsername, adminPasswordHash, List.of(new SimpleGrantedAuthority("ROLE_ADMIN")));
    }
}
