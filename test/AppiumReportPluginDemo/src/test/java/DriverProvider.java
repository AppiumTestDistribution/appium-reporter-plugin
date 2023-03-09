import io.appium.java_client.android.AndroidDriver;
import kong.unirest.HttpRequestWithBody;
import kong.unirest.HttpResponse;
import kong.unirest.JsonNode;
import kong.unirest.Unirest;
import org.junit.jupiter.api.extension.*;
import org.junit.jupiter.api.extension.ExtensionContext.Namespace;
import org.openqa.selenium.remote.DesiredCapabilities;

import java.io.FileWriter;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

public class DriverProvider implements ParameterResolver, AfterAllCallback, TestWatcher {

    AndroidDriver driver;
    public static final Namespace NAMESPACE = Namespace.create(DriverProvider.class);
    public static final String HTML_REPORT_DIR = System.getProperty("user.dir");

    @Override
    public boolean supportsParameter(ParameterContext parameterContext, ExtensionContext extensionContext)
            throws ParameterResolutionException {
        return parameterContext.getParameter().getType()
                .equals(AndroidDriver.class);
    }

    @Override
    public AndroidDriver resolveParameter(ParameterContext parameterContext, ExtensionContext extensionContext) throws ParameterResolutionException {
        try {
            DesiredCapabilities cap = new DesiredCapabilities();
            cap.setCapability("platformName", "Android");
            cap.setCapability("deviceName", "Pixel 2 API 30");
            cap.setCapability("automationName", "UiAutomator2");
            cap.setCapability("appWaitActivity", "com.wdiodemoapp.*");
            cap.setCapability("app", System.getProperty("user.dir")+ "/app/Android.apk");
            driver = new AndroidDriver(new URL("http://127.0.0.1:4723"), cap);
            driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
        } catch (MalformedURLException e) {
            System.out.println("Appium server URL is wrong!");
        }
        return driver;
    }

    public void quitDriver(AndroidDriver driver){
        if(driver != null && driver.getSessionId() != null)
            driver.quit();
        driver = null;
    }

    public String getSessionId(AndroidDriver driver){
        String sessionId;
        try {
            sessionId = driver.getSessionId().toString();
        } catch (Exception e){
            sessionId = UUID.randomUUID().toString();
        }
        return sessionId;
    }

    @Override
    public void testDisabled(ExtensionContext context, Optional<String> reason) {
        setTestInfo(null, context.getDisplayName(), "PENDING", null);
        quitDriver(driver);
    }

    @Override
    public void testSuccessful(ExtensionContext context) {
        setTestInfo(getSessionId(driver), context.getDisplayName(), "PASSED", null);
        quitDriver(driver);
    }

    @Override
    public void testFailed(ExtensionContext context, Throwable cause) {
        setTestInfo(getSessionId(driver), context.getDisplayName(), "FAILED", cause.toString().replace("\n", "\\n"));
        quitDriver(driver);
    }

    @Override
    public void testAborted(ExtensionContext context, Throwable cause) {
        setTestInfo(getSessionId(driver), context.getDisplayName(), "Aborted", null);
        quitDriver(driver);
    }

    public static void setSkippedTestInfo(String testName, String testStatus, String error) {
        try {
            String url = "http://localhost:4723/setTestInfo";
            String body = "{" +
                    "\"testName\":\""+testName+"\"," +
                    "\"testStatus\":\""+testStatus+"\"," +
                    "\"error\":\""+error+"\"" +
                    "}";
            System.out.println("url = " + url);
            System.out.println("Body of setTestInfo = " + body);
            HttpResponse<JsonNode> jsonNodeHttpResponse = Unirest.post(url)
                    .header("Content-Type", "application/json")
                    .body(body).asJson();
        } catch (Exception e){
            System.out.println("Failed to set Test info");
        }
    }

    public static void setTestInfo(String sessionId, String testName, String testStatus, String error) {
        try {
            String url = "http://localhost:4723/setTestInfo";
            String body = "{" +
                        "\"sessionId\":\""+sessionId+"\"," +
                        "\"testName\":\""+testName+"\"," +
                        "\"testStatus\":\""+testStatus+"\"," +
                        "\"error\":\""+error+"\"" +
                        "}";
            System.out.println("url = " + url);
            System.out.println("Body of setTestInfo = " + body);
            HttpResponse<JsonNode> jsonNodeHttpResponse = Unirest.post(url)
                    .header("Content-Type", "application/json")
                    .body(body).asJson();
        } catch (Exception e){
            System.out.println("Failed to set Test info");
        }

    }

    public String getReport() throws IOException, InterruptedException {
        String url = "http://localhost:4723/getReport";
        String s = Unirest.get(url).asString().getBody();
        return s;
    }

    public void deleteReportData() throws IOException, InterruptedException {
        String url = "http://localhost:4723/deleteReportData";
         Unirest.delete(url).asEmpty();
    }

    public void createReportFile(String data, String fileName) throws IOException {
        FileWriter fileWriter = new FileWriter(HTML_REPORT_DIR + "/" + fileName + ".html");
        fileWriter.write(data);
        fileWriter.close();
    }

    @Override
    public void afterAll(ExtensionContext extensionContext) throws Exception {
        String report = getReport();
        deleteReportData();
        createReportFile(report, "finalReport");
    }
}
