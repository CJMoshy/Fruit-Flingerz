type dx = 1 | -1;

export default class Projectile extends Phaser.Physics.Arcade.Sprite {
    private velocity: number;
    private dx: dx;
    private directionVector: Phaser.Math.Vector2;
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string,
        frame: number,
        velocity: number,
        dx?: dx,
    ) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true, undefined, undefined, true);
        this.setScale(0.75);

        this.velocity = velocity;
        if (dx) {
            this.dx = dx;
        } else this.dx = 1;
        // this.dx = dx;
        this.directionVector = this.determineDirection();

        this.body?.world.on(
            "worldbounds",
            (body: Phaser.Physics.Arcade.Body) => {
                if (body.gameObject === this) {
                    this.destroy();
                }
            },
        );

        this.fire();
    }

    determineDirection() {
        return new Phaser.Math.Vector2(this.dx, 0);
    }

    fire() {
        this.setVelocityX(this.directionVector.x * this.velocity);
    }
}
