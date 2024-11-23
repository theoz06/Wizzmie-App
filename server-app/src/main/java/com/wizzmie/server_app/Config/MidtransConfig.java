package com.wizzmie.server_app.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.midtrans.Midtrans;

@Configuration
public class MidtransConfig {
    
    @Bean
    public void configureMidtrans() {
        Midtrans.serverKey = "SB-Mid-server-i1Zl0vN5onOKbk0CJ-EYr3bm";
        Midtrans.isProduction = false;
    }
}
