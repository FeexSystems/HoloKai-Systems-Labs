import logging
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor, ConsoleSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

def setup_telemetry(app):
    """
    Configures OpenTelemetry for the FastAPI application.
    Exports traces to the console by default. Can be extended to Datadog/Sentry.
    """
    provider = TracerProvider()
    processor = BatchSpanProcessor(ConsoleSpanExporter())
    provider.add_span_processor(processor)
    trace.set_tracer_provider(provider)
    
    FastAPIInstrumentor.instrument_app(app)
    
    # Configure basic standard logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("holokai.telemetry")
    logger.info("OpenTelemetry instrumented successfully.")
