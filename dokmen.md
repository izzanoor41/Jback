Build AI with Confluent Intelligence in Confluent Cloud

Confluent Intelligence enables you to seamlessly integrate large-language models (LLMs), machine learning (ML), retrieval-augmented generation (RAG), and agentic AI into your streaming data workflows.

Confluent Intelligence is a suite of the following features.

Streaming Agents: Use Streaming Agents to build AI workflows that can invoke tools to interact with external systems, perform actions, or retrieve information as part of an AI workflow.

Real-time Context Engine: The Real-time Context Engine continuously materializes enriched enterprise data sets into a fast, in-memory cache and serves them to AI systems by using the Model Context Protocol (MCP), all fully managed within Confluent Cloud.

Built-in machine learning (ML) functions: Confluent Cloud for Apache Flink provides built-in functions for building ML workflows, like ML_DETECT_ANOMALIES and ML_FORECAST.

Streaming Agents


Streaming Agents with Confluent Intelligence

The key to agentic AI isn’t building better LLMs – it’s data readiness.

Streaming Agents bridge the gap between enterprise data and AI capabilities by providing:

Real-time data access: Fresh, contextualized data for AI decision-making

Unified data processing: Seamless integration of streaming and batch data

Enterprise data utilization: Effective use of existing enterprise data assets

Context-aware automation: Agents that understand and act on current business context

With Streaming Agents, you can:

Unify stream processing and agentic AI workflows using familiar Flink APIs, simplifying development and enabling every engineer to be an AI engineer.

Integrate seamlessly with any tool, model, and data system.

Access real-time context to enable agents to operate dynamically on live operational events and effectively use LLMs as reasoning engines to plan, decide, and act.

Ensure agents are secure and trustworthy with full visibility, control, and secure, governed event flows.

For more information, see Streaming Agents.

Real-time Context Engine


Real-time Context Engine with Confluent Intelligence

The Real-time Context Engine enables AI agents to query the most up-to-date context, grounding their responses in real-time data. It supports structured data with lookup by primary key. The Real-time Context Engine is available to AI agents by using MCP and works with any agent, hosted anywhere, as long as it supports MCP.

Real-time Context Engine tables are always loaded in memory, so they provide low-latency response times for agent queries. AI agents require fast access to relevant data to make informed decisions and provide accurate responses. The Real-time Context Engine provides the low-latency data access needed for real-time AI agent context serving.

For more information, see Real-time Context Engine.

Built-in machine learning (ML) functions


Built-in ML functions with Confluent Cloud for Apache Flink

Simplify complex data science tasks into Flink SQL statements. Built-in ML functions enable forecasting and anomaly detection with Flink SQL functions to derive real-time insights, with no ML expertise or model building needed.

Do continuous forecasting on time-series streaming data, with out-of-the-box configuration (Auto-ARIMA) or custom user configuration, like training size, seasonality, and forecast horizon.

Perform anomaly detection for each new event.

See real-time visualizations, like time-series charts and graphs showing forecasted values and anomalies.

Built-in ML Functions provide time-series Forecasting and Anomaly Detection SQL functions for streaming data, enabling you to derive real-time insights. These functions simplify complex data science tasks into Flink SQL, providing a familiar yet powerful way to apply AI to streaming data. Built on top of popular ML algorithms like ARIMA optimized for real-time performance, the functions deliver accurate forecasts and reliable anomaly detection.

With built-in ML functions, you can:

Eliminate the need for batch processes

Bridge the gap between data analysis and machine learning

Gain real-time, actionable insights

Built-in ML functions make it easier for you to harness the full potential of AI-driven analytics. SQL functions enable real-time analysis, reduce complexity, and speed up decision-making by delivering insights immediately as the data is ingested. Built-in forecasting and anomaly detection make real-time AI accessible to everyone, enabling agents and teams to make smarter decisions faster.

Common use cases include:

Operational monitoring: Detect system failures or performance issues in real time, minimizing downtime.

Financial forecasting: Predict trends and identify irregular transactions in streaming financial data.

IoT analytics: Monitor sensor data in industrial settings to detect equipment malfunctions or predict maintenance needs.

Retail analytics: Forecast demand and optimize inventory by identifying purchasing trends in real time.

Marketing: Monitor marketing campaign performance in real-time.

Built-in ML functions

The following functions are available for building ML workflows.

ML_DETECT_ANOMALIES: Detect anomalies in your data.

ML_EVALUATE: Evaluate the performance of an AI/ML model.

ML_FORECAST: Forecast trends in your data.

ML_PREDICT: Run a remote AI/ML model for tasks like predicting outcomes, generating text, and classification.

ML preprocessing utility functions like these are available for building ML workflows.

ML_BUCKETIZE: Bucketize a column.

ML_CHARACTER_TEXT_SPLITTER, ML_FILE_FORMAT_TEXT_SPLITTER, ML_RECURSIVE_TEXT_SPLITTER: Split a column into multiple columns.

ML_LABEL_ENCODER, ML_ONE_HOT_ENCODER: Encode a column.

ML_MAX_ABS_SCALER, ML_MIN_MAX_SCALER: Scale a column.

ML_NGRAMS: Create n-grams.

ML_NORMALIZER: Normalize a column.

ML_ROBUST_SCALER, ML_STANDARD_SCALER: Scale a column.

For more information, see Built-in AI/ML Functions.

Supporting technologies

Confluent provides these supporting technologies for building AI/ML workflows.

Remote Model and Managed Model Support: Connect to remote AI and ML models hosted on various platforms, like OpenAI, AWS Bedrock, AWS Sagemaker, Google Cloud’s Vertex AI, and Azure AI. This means you can leverage models hosted outside Confluent Cloud for real-time predictions and inference. Also, you can run fully managed AI models in Confluent Cloud by using the Confluent managed models.

External Tables: Enable data streams to be enriched with non-Kafka data sources to provide the most current and complete views possible. Confluent Cloud for Apache Flink provides functions for searching over external tables, like KEY_SEARCH_AGG, TEXT_SEARCH_AGG, and VECTOR_SEARCH_AGG.

Real-time embedding support: Confluent Cloud for Apache Flink provides built-in functions for creating embeddings, like AI_EMBEDDING.

Secure Connections: Secure, reusable way to integrate and manage connectivity with external systems.

Flink SQL integration: Confluent Cloud for Apache Flink provides a Flink SQL interface for creating and managing model, agent, and tool resources. You can use a SQL statement to create a model resource and pass it on for inference in streaming queries. The SQL interface is available in Cloud Console and the Flink SQL shell.

Remote model and managed model inference


Remote model inference with Confluent Cloud for Apache Flink

Confluent Cloud for Apache Flink enables running inference with remote AI/ML models in Flink SQL statements.

Also, as an Early Access Program feature, you can run fully managed AI models in Confluent Cloud by using the Confluent managed models. For more information, see Run a managed AI Model.

AI model inference enables agents to call LLMs for real-time reasoning and helps implement retrieval-augmented generation (RAG) by using AI models as first-class resources in Flink SQL.

Utilize AI models directly within Flink SQL queries

Manage remotely hosted AI models with SQL DDL statements

Invoke remote AI model endpoints, like OpenAI, AzureML, and AWS SageMaker.

Model inference enables you to simplify the development and deployment of AI/ML applications by providing a unified platform for both data processing and AI/ML tasks.

Simplify development by using familiar SQL syntax to enable agents to interact directly with AI/ML models, including LLMs, reducing the need for specialized ML tools and languages.

Seamlessly coordinate between data processing and AI workflows to improve efficiency and reduce operational complexity.

Enable accurate, real-time AI decision-making by leveraging fresh, contextual streaming data to support patterns like Retrieval-Augmented Generation (RAG), which updates LLM models with real-time information

By working with AI/ML models directly as first-class resources within Flink, you can now utilize them within your SQL queries using a familiar syntax for data processing. This approach allows you to create and manage remotely hosted models using SQL Data Definition language (DDL) statements, eliminating the need to interact with the underlying infrastructure.

You can call remote model endpoints, like OpenAI, GCP Vertex AI, AWS SageMaker, and Azure, and receive inference results in your Flink jobs. This integration enables seamless use of remote AI/ML models in your real-time data pipeline, enhancing the flexibility and scalability of your AI applications.

CREATE MODEL Statement

The CREATE MODEL statement registers a remote model in your Flink environment for real-time prediction and inference over streaming data.

Model inference in streaming queries

Once a model is registered, you can use it in your Flink SQL statements to run inference. Confluent Cloud for Apache Flink provides built-in functions for AI/ML workflows with your registered models.

Model Versioning

Basic model versioning capabilities enable you to manage different versions of models.

Supported platforms

The following platforms are supported for remote model inference.

AWS Bedrock: Navigate to the AWS Bedrock site, select a foundation model, and use the provided model ID and endpoint for inference.

AWS Sagemaker: Similar to AWS Bedrock, but using Sagemaker Studio.

OpenAI: Use OpenAI’s API for model inference.

Google Cloud Vertex AI: Integrate models hosted on Vertex AI.

Azure AI Foundry: Use models hosted on Azure AI and Azure ML.

The following models are supported in Early Access for managed model inference:

BAAI/bge-large-en-v1.5 (embedding)

google/gemma-2-2b-it (LLM)

intfloat/e5-base-v2 (embedding)

meta-llama/Llama-3.1-8B-Instruct (LLM)

microsoft/Phi-3.5-mini-instruct (LLM)

Qwen/Qwen2.5-7B-Instruct (LLM)

External tables and search


External tables and search with Confluent Cloud for Apache Flink

External tables and search enable data streams to be enriched with non-Apache Kafka® data sources to provide the most current and complete views possible. External tables enable capabilities like:

Real-time data enrichment: Join real-time data streams with data from relational databases, vector databases, and REST APIs to enable more accurate AI decision-making and agentic RAG.

Unified search: Use Flink SQL to perform both vector search for RAG and quick external table lookups, eliminating complex data synchronization.

Native integration: Ensure reliability and scalability with a native Flink integration that eliminates custom-built failure points while leveraging Confluent Cloud’s security features and public and private networking capabilities.

Context-aware AI: Provide agents with the most current and complete data for accurate decision-making.

For more information, see Search External Tables.

Real-time embedding support


Real-time embedding support with Confluent Cloud for Apache Flink

Provide fresh, accurate context with real-time embeddings, which continuously turn unstructured enterprise data into vector embeddings to enable RAG and mitigate LLM hallucinations.

Use any embedding model, like OpenAI, Amazon, or Google Gemini, to any vector database, like MongoDB Atlas, Pinecone, Elastic, or Couchbase, across any cloud. Save time with Create Embeddings Action, which is a no-code shortcut for vectorizing data in just a few clicks.

For more information, see Create Embeddings.

Secure connections


Secure connections with Confluent Cloud for Apache Flink

Reusable connection resources provide a secure way to seamlessly integrate and manage connectivity with external systems. Connections on Confluent Cloud enable secure connections to models, vector databases, and MCP directly using Flink SQL.

Secure integration: Connect to relational and vector databases, models, REST APIs, and MCP servers using Flink SQL.

Credential management: Securely pass secrets for external systems, ensuring sensitive credentials are stored separately and never exposed in catalog metadata, logs, or configuration files.

Reusability: Enable the same connection to be shared across multiple tables, models, and functions.

Centralized management: Centralize connection management for large-scale deployments.

Connecting to models, vector databases, and MCP is crucial for building agents. Connections in Flink provide a secure, reusable way to manage external connectivity. Sensitive credentials are stored separately from connection metadata, enabling seamless and secure integration with external systems.

For more information, see Reuse Confluent Cloud Connections With External Services.

Flink SQL integration

Confluent Cloud for Apache Flink provides a Flink SQL interface for creating and managing model, agent, and tool resources. You can use a SQL statement to create a model resource and pass it on for inference in streaming queries. The SQL interface is available in Cloud Console and the Flink SQL shell.

CREATE MODEL: Create a model resource.

CREATE AGENT: Create an agent resource.

CREATE TOOL: Create a tool resource.

Model inference and agentic AI functions like these are available for building AI/ML workflows.

AI_TOOL_INVOKE: Invoke model context protocol (MCP) tools and user-defined functions (UDFs) in your streaming agents.

AI_COMPLETE: Generate text completions.

AI_EMBEDDING: Create embeddings.

ML_PREDICT: Run an AI/ML model for tasks like predicting outcomes, generating text, and classification.

For more information, see Run an AI Model.

RBAC for model inference

The following table shows the model actions that are available for different RBAC permissions.

Role

CREATE MODEL

Invoke model for prediction

List/Describe Models

DROP MODEL

Grant permissions on models

OrganizationAdmin

Yes

Yes

Yes

Yes

Yes

EnvironmentAdmin

Yes

Yes

Yes

Yes

Yes

CloudClusterAdmin

Yes 1

Yes 1

Yes 1

Yes 1

Yes 1

ModelDeveloperManage

Yes

No

Yes

Yes

No

ModelDeveloperRead

No

Yes

Yes

No

No

ModelDeveloperWrite

Yes

Yes

Yes

No

No

ModelResourceOwner

Yes

Yes

Yes

Yes

Yes

[1](1,2,3,4,5)

For own Kafka cluster.



tuh dokumntasi tambahn dari si lombanya entah gmna suurhnya kamu ada mcp kamu punya toolsnya harusny akamu pinter dah bisa bebas atur ajlah



atau jangan luap simpen nih link documntasinya #URL: https://docs.confluent.io/cloud/current/overview.html 



atau ini Confluent Connectors: Explore the vast library of pre-built connectors to stream data from any source or to any sink.

Connect to External Services in Confluent Cloud

Confluent Cloud offers pre-built, fully-managed, Apache Kafka® Connectors that make it easy to instantly connect to popular data sources and sinks. With a simple UI-based configuration and elastic scaling with no infrastructure to manage, Confluent Cloud Connectors make moving data in and out of Kafka an effortless task, giving you more time to focus on app development.

Get Started for Free

Sign up for a Confluent Cloud trial and get $400 of free credit.

Source connector

A source connector, such as the Microsoft SQL Server Source connector, ingests entire databases and streams table updates to Kafka topics. It can also collect metrics from all of your application servers and store these in Kafka topics, making the data available for stream processing with low latency.

Sink connector

A sink connector delivers data from Kafka topics into secondary indexes, such as Google BigQuery or batch systems like Amazon S3, for offline analysis.

For connector billing information, see Kafka Connect Billing.

For connector limitations, see Limits for Fully-Managed Connectors for Confluent Cloud.

Tip

If you want to bring your custom connector to Confluent Cloud, see Install Custom Connectors for Confluent Cloud.

Connect with Confluent is a program where partners work with Confluent to set up a Partner Integration. From this integration, your customers can start producing and consuming with a few clicks in your UI. For more information, see Connect with Confluent for Confluent Cloud.

Support policy for Confluent Cloud connectors

Important

Confluent connectors will not support data systems or versions that are no longer supported by their vendors. This policy becomes effective immediately once the data system or version reaches its end of support (EOS) date. For example, if Oracle ends the support for Oracle Database release version 19c on December 31, 2032, Confluent connectors will also end support for Oracle Database release version 19c on that same date.

The following are the lifecycle phases for fully-managed connectors:

General availability: The connectors are in active development and fully supported.

Deprecated: The deprecated connector will no longer be in active development. Note the following for the deprecated connectors:

From the deprecation day, users have one year to migrate to the recommended connector before the deprecated connector reaches end of life (EOL).

The connectors will be supported during this phase, and users can still access the connector documentation.

Important

Migration path: Confluent strongly recommends that users migrate to a respective supported connector before reaching the EOL date.

End of life (EOL): The deprecated connectors that reach the EOL are discontinued from Confluent Cloud and no longer supported. After the EOL date, note the following:

Existing deprecated connectors will cease to function.

Connector documentation will be archived and will no longer be maintained.


Support lifecycle phases for fully-managed connectors

Deprecated connectors

The following fully-managed connectors are deprecated:

Fully-managed connectors

Deprecation date

End of life date

Migration path

Google BigQuery Sink [Deprecated]

January 9, 2025

January 9, 2026

Migrate to Google BigQuery Sink V2

Google Cloud Functions Sink [Deprecated]

January 9, 2025

January 9, 2026

Migrate to Google Cloud Functions Gen 2 Sink

PostgreSQL CDC Source (Debezium) [Deprecated]

January 9, 2025

January 9, 2026

Migrate to PostgreSQL CDC Source V2 (Debezium)

MySQL CDC Source (Debezium) [Deprecated]

January 9, 2025

January 9, 2026

Migrate to MySQL CDC Source V2 (Debezium)

Microsoft SQL Server CDC Source (Debezium) [Deprecated]

January 9, 2025

January 9, 2026

Migrate to Microsoft SQL Server CDC Source V2 (Debezium)

PagerDuty Sink [Deprecated]

January 9, 2025

January 9, 2026

Migrate to HTTP Sink V2

Google Cloud Dataproc Sink [Deprecated]

January 9, 2025

January 9, 2026

No recommendation available

Supported connectors

The following fully-managed connectors are supported:

ActiveMQ Source

AlloyDB Sink

Amazon CloudWatch Logs Source

Amazon CloudWatch Metrics Sink

Amazon DynamoDB CDC Source

Amazon DynamoDB Sink

Amazon Kinesis Source

Amazon Redshift Sink

Amazon S3 Sink

Amazon S3 Source

Amazon SQS Source

AWS Lambda Sink

Azure Blob Storage Sink

Azure Blob Storage Source

Azure Cognitive Search Sink

Azure Cosmos DB Sink

Azure Cosmos DB Sink V2

Azure Cosmos DB Source

Azure Cosmos DB Source V2

Azure Data Lake Storage Gen2 Sink

Azure Event Hubs Source

Azure Functions Sink

Azure Log Analytics Sink

Azure Service Bus Source

Azure Synapse Analytics Sink

ClickHouse Sink

Couchbase Source

Couchbase Sink

Databricks Delta Lake Sink

Datadog Metrics Sink

Datagen Source (development and testing)

Elasticsearch Service Sink

GitHub Source

Google BigQuery Sink [Deprecated]

Google BigQuery Sink V2

Google Cloud BigTable Sink

Google Cloud Functions Gen 2 Sink

Google Cloud Functions Sink [Deprecated]

Google Cloud Pub/Sub Source

Google Cloud Spanner Sink

Google Cloud Storage Sink

Google Cloud Storage Source

HTTP Sink

HTTP Sink V2

HTTP Source

HTTP Source V2

IBM MQ Source

InfluxDB 2 Sink

InfluxDB 2 Source

Jira Source

MariaDB CDC Source

Microsoft SQL Server CDC Source (Debezium) [Deprecated]

Microsoft SQL Server CDC Source V2 (Debezium)

Microsoft SQL Server Sink (JDBC)

Microsoft SQL Server Source (JDBC)

MongoDB Atlas Sink

MongoDB Atlas Source

MQTT Sink

MQTT Source

MySQL CDC Source (Debezium) [Deprecated]

MySQL CDC Source V2 (Debezium)

MySQL Sink (JDBC)

MySQL Source (JDBC)

Neo4j Sink

New Relic Metrics Sink

OpenSearch Sink

Oracle CDC Source

Oracle XStream CDC Source

Oracle Database Sink (JDBC)

Oracle Database Source (JDBC)

PagerDuty Sink [Deprecated]

PostgreSQL CDC Source (Debezium) [Deprecated]

PostgreSQL CDC Source V2 (Debezium)

PostgreSQL Sink (JDBC)

PostgreSQL Source (JDBC)

RabbitMQ Sink

RabbitMQ Source Connector

Redis Sink

Redis Kafka Sink

Redis Kafka Source

Salesforce Bulk API 2.0 Sink

Salesforce Bulk API 2.0 Source

Salesforce Bulk API Source

Salesforce CDC Source

Salesforce Platform Event Sink

Salesforce Platform Event Source

Salesforce PushTopic Source

Salesforce SObject Sink

ServiceNow Sink

ServiceNow Source [Legacy]

ServiceNow Source V2

SFTP Sink

SFTP Source

Snowflake Sink

Snowflake Source

Solace Sink

Splunk Sink

Zendesk Source

Preview connectors

Important

Preview features are not currently supported and are not recommended for production use. A preview feature is a Confluent Cloud component that is being introduced to gain early feedback. Preview connectors and features can be used for evaluation and non-production testing purposes or to provide feedback to Confluent. Comments, questions, and suggestions related to preview features are encouraged and can be submitted to ccloud-connect-preview@confluent.io.

Note that Preview connectors are billed in the same way as other managed connectors. For more information, see Managed connectors and custom connectors.

The following Confluent Cloud connectors are available for preview:

Pinecone Sink

Custom connectors

For information about bringing your custom connector to Confluent Cloud, see Install Custom Connectors for Confluent Cloud.

Cloud platforms support

The following table shows the cloud platforms supported by each connector by default. To enable a sink connector on a different cloud, contact Confluent Support.

Cloud Connector

AWS

Azure

Google Cloud

Amazon CloudWatch Logs Source

Yes

Yes

Yes

Amazon CloudWatch Metrics Sink

Yes

No

No

Amazon DynamoDB Sink

Yes

No

No

Amazon Kinesis Source

Yes

Yes

Yes

Amazon Redshift Sink

Yes

No

No

Amazon S3 Sink

Yes

No

No

Amazon S3 Source

Yes

Yes

Yes

Amazon SQS Source

Yes

Yes

Yes

AWS Lambda Sink

Yes

No

No

Azure Blob Storage Sink

No

Yes

No

Azure Blob Storage Source

Yes

Yes

Yes

Azure Cognitive Search Sink

No

Yes

No

Azure Cosmos DB Sink

No

Yes

No

Azure Cosmos DB Sink V2

No

Yes

No

Azure Cosmos DB Source

No

Yes

No

Azure Cosmos DB Source V2

No

Yes

No

Azure Data Lake Storage Gen2 Sink

No

Yes

No

Azure Event Hubs Source

Yes

Yes

Yes

Azure Functions Sink

No

Yes

No

Azure Service Bus Source

Yes

Yes

Yes

Azure Synapse Analytics Sink

No

Yes

No

ClickHouse Sink

Yes

Yes

Yes

Couchbase Source

Yes

Yes

Yes

Couchbase Sink

Yes

Yes

Yes

Databricks Delta Lake Sink

Yes

No

No

Datadog Metrics Sink

Yes

Yes

Yes

Datagen Source

Yes

Yes

Yes

Elasticsearch Service Sink

Yes

Yes

Yes

GitHub Source

Yes

Yes

Yes

Google BigQuery Sink [Deprecated]

No

No

Yes

Google BigQuery Sink V2

No

No

Yes

Google Cloud BigTable Sink

No

No

Yes

Google Cloud Dataproc Sink

No

No

Yes

Google Cloud Functions Gen 2 Sink

Yes

Yes

Yes

Google Cloud Functions Sink

No

No

Yes

Google Cloud Pub/Sub Source

Yes

Yes

Yes

Google Cloud Spanner Sink

No

No

Yes

Google Cloud Storage Sink

No

No

Yes

Google Cloud Storage Source

Yes

Yes

Yes

HTTP Sink

Yes

Yes

Yes

HTTP Source

Yes

Yes

Yes

IBM MQ Source

Yes

Yes

Yes

InfluxDB 2 Sink

Yes

Yes

Yes

InfluxDB 2 Source

Yes

Yes

Yes

Jira Source

Yes

Yes

Yes

MariaDB CDC Source

Yes

Yes

Yes

Microsoft SQL Server Sink

Yes

Yes

Yes

Microsoft SQL Server Source CDC (Debezium) [Deprecated]

Yes

Yes

Yes

Microsoft SQL Server Source CDC V2 (Debezium)

Yes

Yes

Yes

Microsoft SQL Server Source

Yes

Yes

Yes

MongoDB Atlas Sink

Yes

Yes

Yes

MongoDB Atlas Source

Yes

Yes

Yes

MQTT Sink

Yes

Yes

Yes

MQTT Source

Yes

Yes

Yes

MySQL Sink

Yes

Yes

Yes

MySQL Source CDC (Debezium) [Deprecated]

Yes

Yes

Yes

MySQL Source CDC V2 (Debezium)

Yes

Yes

Yes

MySQL Source

Yes

Yes

Yes

Neo4j Sink

Yes

Yes

Yes

New Relic Metrics Sink

Yes

Yes

Yes

OpenSearch Sink

Yes

Yes

Yes

Oracle CDC Source

Yes

Yes

Yes

Oracle XStream CDC Source

Yes

Yes

Yes

Oracle Database Sink

Yes

Yes

Yes

Oracle Database Source

Yes

Yes

Yes

PagerDuty Sink

Yes

Yes

Yes

Pinecone Sink

Yes

No

No

PostgreSQL CDC Source (Debezium) [Deprecated]

Yes

Yes

Yes

PostgreSQL CDC Source V2 (Debezium)

Yes

Yes

Yes

PostgreSQL Sink

Yes

Yes

Yes

PostgreSQL Source

Yes

Yes

Yes

RabbitMQ Sink Connector

Yes

Yes

Yes

RabbitMQ Source

Yes

Yes

Yes

Redis Sink

Yes

Yes

Yes

Salesforce Bulk API 2.0 Sink

Yes

Yes

Yes

Salesforce Bulk API 2.0 Source

Yes

Yes

Yes

Salesforce Bulk API Source

Yes

Yes

Yes

Salesforce CDC Source

Yes

Yes

Yes

Salesforce Platform Event Sink

Yes

Yes

Yes

Salesforce Platform Event Source

Yes

Yes

Yes

Salesforce PushTopic Source

Yes

Yes

Yes

Salesforce SObject Sink

Yes

Yes

Yes

ServiceNow Sink

Yes

Yes

Yes

ServiceNow Source V2

Yes

Yes

Yes

ServiceNow Source

Yes

Yes

Yes

SFTP Sink

Yes

Yes

Yes

SFTP Source

Yes

Yes

Yes

Snowflake Sink

Yes

Yes

Yes

Snowflake Source

Yes

Yes

Yes

Solace Sink

Yes

Yes

Yes

Splunk Sink

Yes

Yes

Yes

Zendesk Source

Yes

Yes

Yes

Networking and DNS

For information about managed connector networking, see Manage Networking for Confluent Cloud Connectors.

Confluent Cloud API for fully-managed and custom connectors

For information and examples to use with the Confluent Cloud API for fully-managed and custom connectors, see the Confluent Cloud API for Connect Usage Examples documentation.

Cloud Console connector controls

You can use the GUI buttons to pause, resume, and restart an existing connector. Select and display one of your listed connectors to view the controls.


Manage the connector control status

If you pause a managed connector, the connector is still active and hourly base costs for tasks assigned to the connector continue to accrue. For more information, see Managed connectors and custom connectors.

The following fully-managed connectors do not support restart functionality:

Microsoft SQL Server CDC Source (Debezium) [Deprecated]

Microsoft SQL Server CDC Source V2 (Debezium)

MySQL CDC Source (Debezium) [Deprecated]

MySQL CDC Source V2 (Debezium)

Oracle CDC Source

PostgreSQL CDC Source (Debezium) [Deprecated]

PostgreSQL CDC Source V2 (Debezium)

Connector data previews

For information about connector data previews, see Data Previews for Confluent Cloud Connectors.

Single message transforms

For information about using single message transforms (SMTs), see Configure Single Message Transforms for Kafka Connectors in Confluent Cloud.

View connector events

For information about viewing Confluent Cloud connector events, see View Connector Events for Confluent Cloud.

Important

Viewing connector events is restricted to the OrganizationAdmin RBAC role. Viewing events is not available for other roles.

Connector statuses and notification

For information about Confluent Cloud connector statuses, see Interpret Connector Statuses for Confluent Cloud.

For information about connector state transitions and their notification, see Connector notifications.

Service accounts

For information about setting up service accounts, see Manage Service Accounts for Connectors in Confluent Cloud.

RBAC for fully-managed connectors

For information about RBAC and fully-managed connectors, see Configure RBAC for Connectors in Confluent Cloud.

Dead letter queue

For information about accessing and using the Confluent Cloud Dead Letter Queue, see View Connector Dead Letter Queue Errors in Confluent Cloud.

Connector limitations

To view a list of connector limitations, see Limits for Fully-Managed Connectors for Confluent Cloud.

Manage Offsets

For information about managing offsets for managed connectors, see Manage Offsets for Fully-Managed Connectors in Confluent Cloud.

Provider Integration

For information about setting up IAM role-based authorization using provider integration in fully-managed connectors, see Manage Provider Integration for Fully-Managed Connectors in Confluent Cloud.

Manage CSFLE

For information about managing client-side field level encryption (CSFLE) in fully-managed connectors, see Manage Client-Side Encryption for Fully-Managed Connectors in Confluen



atau intgrasi sama googler cloud intgrasi sinini #URL: https://www.confluent.io/hub/plugins?query=Google 