'use client'

import { useEffect } from 'react'

export function LazyAudioLoader() {
  useEffect(() => {
    const loadAudio = (button: HTMLButtonElement) => {
      const figure = button.closest<HTMLElement>('.prose-vibe-audio')
      const audio = figure?.querySelector<HTMLAudioElement>('audio.prose-vibe-audio__player')
      const label = button.querySelector<HTMLElement>('.prose-vibe-audio__load-text')
      const src = button.dataset.audioSrc
      const type = button.dataset.audioType

      if (!figure || !audio || !src) return

      if (!audio.src) {
        const source = document.createElement('source')
        source.src = src
        if (type) source.type = type
        audio.append(source)
        audio.controls = true
        audio.hidden = false
        audio.load()
      }

      figure.dataset.loaded = 'true'
      if (label) label.textContent = 'Loading'

      void audio
        .play()
        .then(() => {
          if (label) label.textContent = 'Playing'
          button.setAttribute('aria-label', 'Audio loaded')
        })
        .catch(() => {
          if (label) label.textContent = 'Play'
        })
    }

    const onClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof HTMLElement)) return

      const button = target.closest<HTMLButtonElement>('.prose-vibe-audio__load')
      if (!button) return

      event.preventDefault()
      loadAudio(button)
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}
