package com.focoman.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MutablePropertySources;
import org.springframework.core.env.PropertiesPropertySource;

import java.util.Properties;

public class JdbcUrlEnvironmentPostProcessor implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        MutablePropertySources propertySources = environment.getPropertySources();
        
        // Railway provides DATABASE_URL or SPRING_DATASOURCE_URL without the jdbc: prefix
        // This ensures the URL has the correct format for JDBC before the datasource is created
        String rawUrl = environment.getProperty("SPRING_DATASOURCE_URL");
        if (rawUrl == null || rawUrl.isEmpty()) {
            rawUrl = environment.getProperty("DATABASE_URL");
        }

        if (rawUrl != null && !rawUrl.isEmpty() && !rawUrl.startsWith("jdbc:")) {
            String jdbcUrl = "jdbc:" + rawUrl;
            
            Properties properties = new Properties();
            properties.setProperty("spring.datasource.url", jdbcUrl);
            properties.setProperty("SPRING_DATASOURCE_URL", jdbcUrl);
            
            // Set driver class for PostgreSQL if the URL is postgresql
            if (rawUrl.startsWith("postgresql:")) {
                properties.setProperty("spring.datasource.driver-class-name", "org.postgresql.Driver");
                properties.setProperty("spring.jpa.database-platform", "org.hibernate.dialect.PostgreSQLDialect");
            }
            
            // Add the corrected property to the environment with highest priority
            propertySources.addFirst(new PropertiesPropertySource("jdbcUrlFix", properties));
            System.out.println("ADAPTED JDBC URL: " + jdbcUrl);
        }
    }
}