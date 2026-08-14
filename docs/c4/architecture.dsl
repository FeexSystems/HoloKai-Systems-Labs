workspace "Planetary UI Platform" {

  model {
    user = person "End User"

    system = softwareSystem "Planetary-Scale UI Platform" {

      edge = container "Edge Intelligence Layer" {
        geo = component "Geo Router"
        device = component "Device Classifier"
        net = component "Network Profiler"
        decision = component "Route Decision Engine"
      }

      ssr = container "Streaming SSR Engine"
      mfe = container "Micro-Frontend Runtime"
      ai = container "AI Prediction Engine"
      cache = container "Multi-Layer Cache"

      user -> system "Uses"
      system -> edge "Routes through"
      system -> ssr "Streams UI via"
      system -> mfe "Loads UI modules via"
      system -> ai "Requests predictions from"
      system -> cache "Reads/writes cache"
    }
  }

  views {
    systemContext system {
      include *
      autolayout lr
    }

    container system {
      include *
      autolayout lr
    }
  }
}
