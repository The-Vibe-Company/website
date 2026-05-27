'use client'

import { useEffect } from 'react'

export function LazyAudioLoader() {
  useEffect(() => {
    const setPlayingState = (figure: HTMLElement, button: HTMLButtonElement, playing: boolean) => {
      const label = button.querySelector<HTMLElement>('.prose-vibe-audio__load-text')

      figure.dataset.playing = playing ? 'true' : 'false'
      if (label) label.textContent = playing ? 'Pause' : 'Play'
      button.setAttribute('aria-label', playing ? 'Pause audio' : 'Play audio')
    }

    const toggleAudio = (button: HTMLButtonElement) => {
      const figure = button.closest<HTMLElement>('.prose-vibe-audio')
      const audio = figure?.querySelector<HTMLAudioElement>('audio.prose-vibe-audio__player')
      const src = button.dataset.audioSrc
      const type = button.dataset.audioType

      if (!figure || !audio || !src) return

      if (!audio.src) {
        const source = document.createElement('source')
        source.src = src
        if (type) source.type = type
        audio.append(source)
        audio.load()

        audio.addEventListener('pause', () => setPlayingState(figure, button, false))
        audio.addEventListener('ended', () => setPlayingState(figure, button, false))
        audio.addEventListener('play', () => setPlayingState(figure, button, true))
      }

      figure.dataset.loaded = 'true'

      if (!audio.paused) {
        audio.pause()
        return
      }

      void audio
        .play()
        .catch(() => setPlayingState(figure, button, false))
    }

    const onClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof HTMLElement)) return

      const button = target.closest<HTMLButtonElement>('.prose-vibe-audio__load')
      if (!button) return

      event.preventDefault()
      toggleAudio(button)
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}
