import { vec2, vec4 } from "gl-matrix";
import {
  Camera2D,
  Camera2DControl,
  Entity,
  FullScreenCanvas,
  Camera2DManager,
  Input,
  Loop,
  Scene,
  Time,
  Transform2D,
  Component,
  TransformComponent,
  Transform3D,
} from "@aicacia/engine";
import {
  WebCanvas,
  WebEventListener,
  CtxRenderer,
  TransformCtxRendererHandler,
} from "@aicacia/engine/lib/web";
import { Body, BodyEvent, Circle, Collider2D, World, World2D } from "../../src";
import { CtxBody2DRendererHandler } from "../../src/web";

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
    body = new Body<Entity>().addShape(new Circle<Entity>().setDensity(200)),
    scene = new Scene()
      .addEntity(
        // Camera setup
        new Entity()
          .addTag("camera")
          .addComponent(
            new Transform2D()
              .setRenderable(false)
              .setLocalScale2(vec2.fromValues(9, 9)),
            new Camera2DControl(),
            new Camera2D().setBackground(vec4.fromValues(0.98, 0.98, 0.98, 1.0))
          ),
        new Entity().addComponent(
          new StickToMouse(),
          new Transform2D().setLocalPosition(vec2.fromValues(0, 5)),
          new Collider2D(new Body<Entity>().addShape(new Circle()))
            .on(BodyEvent.COLLIDING, () => {
              console.log("colliding");
            })
            .on(BodyEvent.COLLIDE_START, () => {
              console.log("collide-start");
            })
            .on(BodyEvent.COLLIDE_END, () => {
              console.log("collide-end");
            })
        ),
        new Entity().addComponent(new Transform2D(), new Collider2D(body))
      )
      .addPlugin(
        // Required by many Components and plugins
        new Time(),
        // Handles all input
        new Input().addEventListener(new WebEventListener(canvas.getElement())),
        // forces a canvas to stay in sync with the window size
        new FullScreenCanvas(canvas),
        new CtxRenderer(
          canvas,
          canvas.getElement().getContext("2d")
        ).addRendererHandler(
          new TransformCtxRendererHandler(),
          new CtxBody2DRendererHandler()
        ),
        new World2D(new World<Entity>())
      ),
    loop = new Loop(() => scene.update());

  (window as any).scene = scene;
  (window as any).loop = loop;

  document.body.appendChild(canvas.getElement());
  loop.start();
}

window.addEventListener("load", onLoad);
