package com.focoman.config;

import org.springframework.boot.context.event.ApplicationEnvironmentPreparedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MutablePropertySources;
import org.springframework.core.env.PropertiesPropertySource;
import org.springframework.stereotype.Component;

import java.util.Properties;

@Component
public class DatasourceConfig implements ApplicationListener<ApplicationEnvironmentPreparedEvent> {

    @Override
    public void onApplicationEvent(ApplicationEnvironmentPreparedEvent event) {
        ConfigurableEnvironment environment = event.getEnvironment();
        MutablePropertySources propertySources = environment.getPropertySources();
        
        // Railway sometimes provides the database URL without the jdbc: prefix
        // This ensures the URL has the correct format for JDBC before the datasource is created
        String datasourceUrl = environment.getProperty("SPRING_DATASOURCE_URL");
        if (datasourceUrl != null && !datasourceUrl.isEmpty() && !datasourceUrl.startsWith("jdbc:")) {
            Properties properties = new Properties();
            properties.setProperty("SPRING_DATASOURCE_URL", "jdbc:" + datasourceUrl);
            
            // Add the corrected property to the environment
            propertySources.addFirst(new PropertiesPropertySource("datasourceConfig", properties));
        }
    }
}
