# Advanced gradle plugin configuration

If for some reason the Gradle plugin isn't an option for you, here are other ways to get the tasks done:

### Manual Integration

If you choose not to use the Gradle integration, you may handle the processing and upload steps manually. However, we highly recommend that you use the Gradle integration, if at all possible.

### ProGuard UUIDs

After ProGuard files generate, you will need to embed the UUIDs of the ProGuard mapping files in a properties file named `sentry-debug-meta.properties` in the assets folder. The Java SDK will look for the UUIDs there to link events to the correct mapping files on the server-side.

Sentry calculates UUIDs for ProGuard files. For more information about how this works, see [ProGuard UUIDs]({%- link _documentation/workflow/debug-files.md -%}#proguard-uuids).

`sentry-cli` can write the `sentry-debug-meta.properties` file for you:

```bash
sentry-cli upload-proguard \
    --android-manifest app/build/intermediates/manifests/full/release/AndroidManifest.xml \
    --write-properties app/build/intermediates/assets/release/sentry-debug-meta.properties \
    --no-upload \
    app/build/outputs/mapping/{buildVariant}/mapping.txt
```

This file needs to be in your APK, so **run the script before the APK is packaged**. You can do that by creating a Gradle task that runs before the dex packaging.

You can, for example, add a Gradle task after the ProGuard step and before the dex packaging. The dex packaging executes `sentry-cli` to validate, process the mapping files, and write the UUIDs into the properties file:

```groovy
gradle.projectsEvaluated {
    android.applicationVariants.each { variant ->
        def variantName = variant.name.capitalize();
        def proguardTask = project.tasks.findByName(
            "transformClassesAndResourcesWithProguardFor${variantName}")
        def dexTask = project.tasks.findByName(
            "transformClassesWithDexFor${variantName}")
        def task = project.tasks.create(
                name: "processSentryProguardFor${variantName}",
                type: Exec) {
            workingDir project.rootDir
            commandLine *[
                "sentry-cli",
                "upload-proguard",
                "--write-properties",
                "${project.rootDir.toPath()}/app/build/intermediates/assets" +
                    "/${variant.dirName}/sentry-debug-meta.properties",
                variant.getMappingFile(),
                "--no-upload"
            ]
        }
        dexTask.dependsOn task
        task.dependsOn proguardTask
    }
}
```

Alternatively, you can generate a UUID upfront yourself and then force Sentry to honor that UUID after upload. However, this is **strongly discouraged**.

### Uploading ProGuard Files

Finally, manually upload the ProGuard files with `sentry-cli` as follows:

```bash
sentry-cli upload-proguard \
    --android-manifest app/build/intermediates/manifests/full/release/AndroidManifest.xml \
    app/build/outputs/mapping/{buildVariant}/mapping.txt
```
