# HoloKai Semantic Perception

Semantic perception converts Isaac ROS detector output into HoloKai world-model entities.

## Pipeline

```text
Isaac Sim RGB / Depth
        |
        v
 Isaac ROS perception
        |
   detector output
        |
        v
semantic_perception_bridge
        |
        v
/holokai/robot/observation
        |
        v
world_model_bridge
        |
        v
HoloKai World Model
```

## Detector boundary

The detector is intentionally replaceable. The bridge accepts normalized JSON detections so the same HoloKai contract can be fed by RT-DETR, FoundationPose, another Isaac ROS perception graph, or a simulation adapter.

A detector must provide, where available:

- `label`
- `semanticType`
- `confidence`
- `pose`
- `bbox`
- `trackId`
- `provenance`

HoloKai adds a stable `entityId`, epistemic stance, pipeline provenance, and observation timestamp.

## African artifact grounding

The next resolver stage should map detector labels to HoloKai knowledge entities:

```text
visual detection
      |
      v
semantic candidate
      |
      v
HoloKai entity resolver
      |
      +--> civilization
      +--> artifact
      +--> place
      +--> person
      +--> architecture
      |
      v
knowledge graph / vector memory
```

A visual detector must never be treated as historical evidence by itself. Detection confidence describes perception confidence; epistemic stance describes the status of the associated HoloKai knowledge claim. These are separate dimensions.
