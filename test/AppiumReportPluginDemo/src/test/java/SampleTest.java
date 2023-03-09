import io.appium.java_client.AppiumBy;
import io.appium.java_client.android.AndroidDriver;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;


@ExtendWith(DriverProvider.class)
public class SampleTest {

    @Test
    @Disabled
    public void testPass(AndroidDriver driver){
        driver.findElement(AppiumBy.accessibilityId("Login")).click();
        driver.findElement(AppiumBy.accessibilityId("input-email")).sendKeys("admin");
        driver.findElement(AppiumBy.accessibilityId("input-password")).sendKeys("admin");
        driver.findElement(AppiumBy.accessibilityId("button-LOGIN")).click();
    }

    @Test
    public void testFail(AndroidDriver driver){
        driver.findElement(AppiumBy.accessibilityId("Login123")).click();
    }

    @Test
    @Disabled
    public void testSkip(AndroidDriver driver){
        driver.findElement(AppiumBy.accessibilityId("Login123")).click();
    }


}
