import { vec2, vec4 } from "gl-matrix";
import { Entity, Scene, Component } from "@aicacia/ecs";
import {
  Camera2D,
  Camera2DControl,
  FullScreenCanvas,
  Camera2DManager,
  Input,
  EventLoop,
  Time,
  Transform2D,
  TransformComponent,
  Transform3D,
} from "@aicacia/ecs-game";
import {
  WebCanvas,
  WebEventListener,
  CtxRenderer,
  TransformCtxRendererHandler,
} from "@aicacia/ecs-game/lib/web";
import {
  Body,
  BodyEvent,
  Box,
  Circle,
  Collider2D,
  World,
  World2D,
} from "../../src";
import {
  CtxBody2DRendererHandler,
  CtxContactRendererHandler,
} from "../../src/web";

const VEC2_0 = vec2.create();

class StickToMouse extends Component {
  static requiredComponents = [[Transform2D, Transform3D]];
  static requiredPlugins = [Input];

  onUpdate() {
    const input = this.getRequiredPlugin(Input),
      transform = TransformComponent.getRequiredTransform(
        this.getRequiredEntity()
      ),
      camera = this.getRequiredScene()
        .getRequiredManager(Camera2DManager)
        .getRequiredActive(),
      mousePosition = vec2.set(
        VEC2_0,
        input.getButtonValue("mouse-x"),
        input.getButtonValue("mouse-y")
      );

    camera.toWorld(mousePosition, mousePosition);
    transform.setLocalPosition2(mousePosition);

    return this;
  }
}

function onLoad() {
  const canvas = new WebCanvas(
      document.getElementById("canvas") as HTMLCanvasElement
    ).set(256, 256),
    scene = new Scene()
      .addEntity(
        // Camera setup
        new Entity()
          .addTag("camera")
          .addComponent(
            new Transform2D()
              .setRenderable(false)
              .setLocalScale2(vec2.fromValues(2, 2)),
            new Camera2DControl(),
            new Camera2D().setBackground(vec4.fromValues(0.98, 0.98, 0.98, 1.0))
          ),
        new Entity().addComponent(
          new StickToMouse(),
          new Transform2D().setLocalPosition(vec2.fromValues(0, 5)),
          new Collider2D(
            new Body<Entity>().addShape(new Box<Entity>().set(2, 2))
          )
            .on(BodyEvent.COLLIDING, () => {
              // console.log("colliding");
            })
            .on(BodyEvent.COLLIDE_START, () => {
              // console.log("collide-start");
            })
            .on(BodyEvent.COLLIDE_END, () => {
              // console.log("collide-end");
            })
        ),
        new Entity().addComponent(
          new Transform2D(),
          new Collider2D(
            new Body<Entity>().addShape(new Circle<Entity>().setDensity(200))
          )
        )
      )
      .addPlugin(
        // Required by many Components and plugins
        new Time(),
        // Handles all input
        new Input().addEventListener(new WebEventListener(canvas.getElement())),
        // Handles requesting frames on events
        new EventLoop(),
        // forces a canvas to stay in sync with the window size
        new FullScreenCanvas(canvas),
        new CtxRenderer(
          canvas,
          canvas.getElement().getContext("2d")
        ).addRendererHandler(
          new TransformCtxRendererHandler(),
          new CtxBody2DRendererHandler(),
          new CtxContactRendererHandler()
        ),
        new World2D(new World<Entity>())
      );

  (window as any).scene = scene;

  scene.init();
}

window.addEventListener("load", onLoad);
