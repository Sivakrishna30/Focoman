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
        
        // Railway sometimes provides the database URL without the jdbc: prefix
        // This ensures the URL has the correct format for JDBC before the datasource is created
        String datasourceUrl = environment.getProperty("SPRING_DATASOURCE_URL");
        if (datasourceUrl != null && !datasourceUrl.isEmpty() && !datasourceUrl.startsWith("jdbc:")) {
            Properties properties = new Properties();
            properties.setProperty("SPRING_DATASOURCE_URL", "jdbc:" + datasourceUrl);
            
            // Add the corrected property to the environment with highest priority
            propertySources.addFirst(new PropertiesPropertySource("jdbcUrlFix", properties));
        }
    }
}