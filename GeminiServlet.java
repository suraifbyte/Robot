
package servlet;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.BufferedWriter;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@WebServlet("/chat")
public class GeminiServlet extends HttpServlet {

    private static final String API_URL =
        "https://api.groq.com/openai/v1/chat/completions";

    @Override
    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response)
            throws IOException {

        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String message = request.getParameter("message");

        if (message == null || message.trim().isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(
                "{\"error\":\"Please enter a message.\"}"
            );
            return;
        }

        String apiKey = System.getenv("GROQ_API_KEY");

        if (apiKey == null || apiKey.trim().isEmpty()) {
            response.setStatus(
                HttpServletResponse.SC_INTERNAL_SERVER_ERROR
            );
            response.getWriter().write(
                "{\"error\":\"Groq API key is not configured.\"}"
            );
            return;
        }

        HttpURLConnection connection = null;

        try {
            URL url = new URL(API_URL);
            connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setConnectTimeout(15000);
            connection.setReadTimeout(45000);
            connection.setDoOutput(true);

            connection.setRequestProperty(
                "Content-Type", "application/json"
            );
            connection.setRequestProperty(
                "Authorization", "Bearer " + apiKey
            );

            
String systemPrompt =
    "You are RoboMind, a personal AI assistant created by Subhadip Panda " +
    "as a B.Tech Computer Science project. Your name is RoboMind, not ChatGPT. " +
    "If asked who you are, say: I am RoboMind, an AI assistant created by " +
    "Subhadip Panda. I help with learning, answering questions, and voice " +
    "conversations. Be friendly, helpful, and honest about your capabilities. " +
    "Never claim to be ChatGPT.";

String body =
        "{\"model\":\"openai/gpt-oss-120b\"," +
        "\"messages\":[" +
        "{\"role\":\"system\",\"content\":\"" +
        escapeJson(systemPrompt) + "\"}," +
        "{\"role\":\"user\",\"content\":\"" +
        escapeJson(message) + "\"}]," +
        "\"temperature\":0.7}";


            try (OutputStream out = connection.getOutputStream();
                 BufferedWriter writer = new BufferedWriter(
                     new OutputStreamWriter(
                         out, StandardCharsets.UTF_8))) {
                writer.write(body);
            }

            int status = connection.getResponseCode();

            InputStream stream = (status >= 200 && status < 300)
                ? connection.getInputStream()
                : connection.getErrorStream();

            StringBuilder result = new StringBuilder();

            if (stream != null) {
                try (BufferedReader reader = new BufferedReader(
                        new InputStreamReader(
                            stream, StandardCharsets.UTF_8))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        result.append(line);
                    }
                }
            }

            String apiResponse = result.toString();

            if (status < 200 || status >= 300) {
                System.err.println("Groq API HTTP status: " + status);
                System.err.println("Groq API error response: " + apiResponse);

                response.setStatus(
                    HttpServletResponse.SC_BAD_GATEWAY
                );
                response.getWriter().write(
                    "{\"error\":\"Groq could not answer. Check the Tomcat console.\"}"
                );
                return;
            }

            String answer = extractContent(apiResponse);

            if (answer != null) {
                response.getWriter().write(
                    "{\"reply\":\"" + escapeJson(answer) + "\"}"
                );
            } else {
                System.err.println(
                    "Groq response could not be parsed: " + apiResponse
                );
                response.setStatus(
                    HttpServletResponse.SC_BAD_GATEWAY
                );
                response.getWriter().write(
                    "{\"error\":\"Could not read the AI response.\"}"
                );
            }

        } catch (Exception e) {
            System.err.println(
                "RoboMind Groq connection error: " + e.getMessage()
            );
            response.setStatus(
                HttpServletResponse.SC_BAD_GATEWAY
            );
            response.getWriter().write(
                "{\"error\":\"Unable to connect to Groq.\"}"
            );
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }
    }

    private String extractContent(String json) {
        String marker = "\"content\"";
        int keyIndex = json.lastIndexOf(marker);

        if (keyIndex == -1) {
            return null;
        }

        int colonIndex = json.indexOf(
            ':', keyIndex + marker.length()
        );

        if (colonIndex == -1) {
            return null;
        }

        int start = json.indexOf('"', colonIndex + 1);

        if (start == -1) {
            return null;
        }

        StringBuilder value = new StringBuilder();
        boolean escaped = false;

        for (int i = start + 1; i < json.length(); i++) {
            char c = json.charAt(i);

            if (escaped) {
                value.append('\\').append(c);
                escaped = false;
            } else if (c == '\\') {
                escaped = true;
            } else if (c == '"') {
                return unescapeJson(value.toString());
            } else {
                value.append(c);
            }
        }

        return null;
    }

    private String escapeJson(String value) {
        return value.replace("\\", "\\\\")
                    .replace("\"", "\\\"")
                    .replace("\b", "\\b")
                    .replace("\f", "\\f")
                    .replace("\n", "\\n")
                    .replace("\r", "\\r")
                    .replace("\t", "\\t");
    }

    private String unescapeJson(String value) {
        StringBuilder result = new StringBuilder();

        for (int i = 0; i < value.length(); i++) {
            char c = value.charAt(i);

            if (c == '\\' && i + 1 < value.length()) {
                char next = value.charAt(++i);

                switch (next) {
                    case 'n': result.append('\n'); break;
                    case 'r': result.append('\r'); break;
                    case 't': result.append('\t'); break;
                    case 'b': result.append('\b'); break;
                    case 'f': result.append('\f'); break;
                    case '"': result.append('"'); break;
                    case '\\': result.append('\\'); break;
                    case '/': result.append('/'); break;
                    case 'u':
                        if (i + 4 < value.length()) {
                            String hex = value.substring(i + 1, i + 5);
                            try {
                                result.append(
                                    (char) Integer.parseInt(hex, 16)
                                );
                                i += 4;
                            } catch (NumberFormatException ex) {
                                result.append("\\u").append(hex);
                                i += 4;
                            }
                        } else {
                            result.append("\\u");
                        }
                        break;
                    default:
                        result.append('\\').append(next);
                }
            } else {
                result.append(c);
            }
        }

        return result.toString();
    }
}
