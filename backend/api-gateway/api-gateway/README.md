# api-gateway

Quick steps to build/import this module on Windows (no system Maven required).

Prerequisites
- JDK 17+ installed (this project uses Java 21 in the POM). Set `JAVA_HOME` to your JDK installation and restart your terminal or IDE.

Use the included Maven Wrapper (recommended)
1. Open a new Command Prompt or PowerShell.
2. Change into the module folder:

```cmd
cd D:\Delhivery\backend\api-gateway\api-gateway
```

3. Run the Maven Wrapper (Windows):

```cmd
mvnw.cmd -v
mvnw.cmd -f pom.xml -U clean validate
```

This uses the project-provided Maven wrapper (mvnw.cmd) to run Maven without installing Maven system-wide.

If you prefer IntelliJ's bundled Maven (no mvn on PATH needed)
1. File → Settings → Build Tools → Maven → Maven home directory → choose "Bundled (Maven 3)".
2. Open the Maven tool window and click "Reload All Projects".

If you want `mvn` available in PowerShell/cmd
- Install Maven (winget/choco/manual) and add it to PATH. Also set `JAVA_HOME` to your JDK.

Troubleshooting
- If you see "The term 'mvn' is not recognized" in PowerShell, prefer the `mvnw.cmd` command shown above.
- If IntelliJ still doesn't import, ensure project SDK / language level is set to Java 21 (File → Project Structure → Project SDK and Project language level).

If you want, run the batch file located at `D:\Delhivery\backend\run-api-gateway-validate.bat` which runs the wrapper for you.

