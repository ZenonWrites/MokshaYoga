import { useCallback, useMemo } from 'react'
import { Particles, ParticlesProvider } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import { MoveDirection, OutMode } from '@tsparticles/engine'

export default function ParticlesDust() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const init = useCallback(async (engine: any) => {
    await loadSlim(engine)
  }, [])

  const options = useMemo(() => ({
    fullScreen: false,
    background: { color: { value: 'transparent' } },
    fpsLimit: 30,
    particles: {
      number: { value: 38, density: { enable: true } },
      color: { value: '#e8dcc8' },
      shape: { type: 'circle' },
      opacity: {
        value: { min: 0.04, max: 0.18 },
        animation: { enable: true, speed: 0.4, sync: false },
      },
      size: { value: { min: 0.8, max: 2.4 } },
      move: {
        enable: true,
        speed: 0.3,
        direction: MoveDirection.top,
        random: true,
        straight: false,
        outModes: { default: OutMode.out },
      },
    },
    detectRetina: true,
  }), [])

  return (
    <div className="absolute inset-0 pointer-events-none z-10" aria-hidden="true">
      <ParticlesProvider init={init}>
        <Particles
          id="hero-dust"
          options={options}
          style={{ width: '100%', height: '100%', position: 'relative' }}
        />
      </ParticlesProvider>
    </div>
  )
}
