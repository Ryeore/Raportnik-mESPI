package pl.raportnik;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class RaportnikApplication {
    public static void main(String[] args) {
        SpringApplication.run(RaportnikApplication.class, args);
    }
}
