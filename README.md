# commercetools-sendgrid-connector

This connector uses commercetools subscriptions to send customer data to Sendgrid.

At present this connector handles the following commercetools events:

- `customer`: `ResourceCreated` and `ResourceUpdated`

## Customer Creation/Updates

Using the Sendgrid client API the following information will be upserted as contacts:

- email
- first_name
- last_name
- external_id

The commercetools `customer ID` value will be used as the `external_id`
