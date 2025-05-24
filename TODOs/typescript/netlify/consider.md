- Consider adding this command to a YAML for the sake of debugging:

# netlify api getSite --data '{ "site_id": "your-site-id" }' --auth=your-token

- This may be required as sometimes Netlify's CLI fails to deploy a website due to unknown reasons, and it may give unrelated generic error messages.
- For instance, while creating the JS-to-YAML deployment, the CLI failed to deploy to the CS website without altering a couple of things.
