const screen = new Entity()
screen.addComponent(new PlaneShape())
screen.addComponent(new Transform({ position: new Vector3(8, 2, 8) }))
screen.getComponent(Transform).scale.set(1.98, 1.28, 1)
engine.addEntity(screen)

const videoClip = new VideoClip("https://138-68-166-247.nip.io/live/test/index.m3u8")

const videoTexture = new VideoTexture(videoClip)
videoTexture.play()
videoTexture.loop = true

const screenMaterial = new Material()
screenMaterial.albedoTexture = videoTexture
screenMaterial.emissiveTexture = videoTexture
screenMaterial.emissiveColor = Color3.White()
screenMaterial.emissiveIntensity = 0.5
screenMaterial.roughness = 1.0

screen.addComponent(screenMaterial)
