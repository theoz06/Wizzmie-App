// package com.wizzmie.server_app.Config;

// import org.apache.catalina.connector.Connector;
// import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;

// @Configuration
// public class TomcatConfig {
    
//     @Bean
//     public TomcatServletWebServerFactory servletContainer() {
//         TomcatServletWebServerFactory tomcat = new TomcatServletWebServerFactory();
//         tomcat.addAdditionalTomcatConnectors(createHttpConnector());
//         return tomcat;
//     }

//     private Connector createHttpConnector() {
//         Connector connector = new Connector(TomcatServletWebServerFactory.DEFAULT_PROTOCOL);
//         connector.setScheme("http");
//         connector.setPort(8000);
//         connector.setSecure(false);
//         connector.setRedirectPort(443); // port HTTPS
//         return connector;
//     }
// }
