import { useEffects } from '../../context/EffectsContext';

export default function EffectsControls() {
  const { particlesEnabled, soundsEnabled, isReady, updateParticles, updateSounds } = useEffects();

  return (
    <fieldset className="effects-controls">
      <legend>Effects</legend>
      <div className="effects-icon-row">
        <button
          type="button"
          className="effects-icon-button"
          aria-label="Animated particle background"
          aria-pressed={particlesEnabled}
          title={particlesEnabled ? 'Pause particle background' : 'Resume particle background'}
          disabled={!isReady}
          onClick={() => updateParticles(!particlesEnabled)}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {particlesEnabled
              ? <><rect x="7" y="5" width="3" height="14" rx="0.5" /><rect x="14" y="5" width="3" height="14" rx="0.5" /></>
              : <path d="m8 5 11 7-11 7V5Z" />}
          </svg>
        </button>
        <button
          type="button"
          className="effects-icon-button"
          data-audio-toggle
          aria-label="Sound effects"
          aria-pressed={soundsEnabled}
          title={soundsEnabled ? 'Mute sound effects' : 'Enable sound effects'}
          disabled={!isReady}
          onClick={() => updateSounds(!soundsEnabled)}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 5 6 9H3v6h3l5 4V5Z" />
            {soundsEnabled ? <><path d="M15 8a6 6 0 0 1 0 8" /><path d="M18 5a10 10 0 0 1 0 14" /></> : <path d="m16 9 5 6m0-6-5 6" />}
          </svg>
        </button>
      </div>
    </fieldset>
  );
}
