// Import required symbols
import { Resource } from '@opentelemetry/resources';
import { SimpleSpanProcessor, ConsoleSpanExporter } from "@opentelemetry/sdk-trace-base";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
// **DELETE IF SETTING UP A GATEWAY, UNCOMMENT OTHERWISE**
import { GraphQLInstrumentation } from '@opentelemetry/instrumentation-graphql';
import { ZipkinExporter } from "@opentelemetry/exporter-zipkin";


// Register server-related instrumentation
registerInstrumentations({
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
    // **DELETE IF SETTING UP A GATEWAY, UNCOMMENT OTHERWISE**
    new GraphQLInstrumentation()
  ]
});

// Initialize provider and identify this particular service
// (in this case, we're implementing a federated gateway)
const provider = new NodeTracerProvider({
  resource: Resource.default().merge(new Resource({
    // Replace with any string to identify this service in your system
    "service.name": "SALE",
  })),
});

// Configure a test exporter to print all traces to the console
//const consoleExporter = new ConsoleSpanExporter();
//provider.addSpanProcessor(
//  new SimpleSpanProcessor(consoleExporter)
//);

// Configure an exporter that pushes all traces to Zipkin
// (This assumes Zipkin is running on localhost at the
// default port of 9411)
const zipkinExporter = new ZipkinExporter({
  // url: set_this_if_not_running_zipkin_locally
});
provider.addSpanProcessor(
  new SimpleSpanProcessor(zipkinExporter)
);

// Register the provider to begin tracing
provider.register();
