'use client'

import { useEffect } from 'react'

export function LazyAudioLoader() {
  useEffect(() => {
    const formatTime = (seconds: number) => {
      if (!Number.isFinite(seconds) || seconds <= 0) return '0:00'

      const rounded = Math.floor(seconds)
      const minutes = Math.floor(rounded / 60)
      const remainingSeconds = String(rounded % 60).padStart(2, '0')
      return `${minutes}:${remainingSeconds}`
    }

    const updateProgress = (figure: HTMLElement, audio: HTMLAudioElement) => {
      const current = figure.querySelector<HTMLElement>('.prose-vibe-audio__current')
      const duration = figure.querySelector<HTMLElement>('.prose-vibe-audio__duration')
      const wave = figure.querySelector<HTMLElement>('.prose-vibe-audio__wave')
      const audioDuration = Number.isFinite(audio.duration) ? audio.duration : 0
      const audioCurrentTime = Number.isFinite(audio.currentTime) ? audio.currentTime : 0
      const progress = audioDuration > 0 ? Math.min(100, Math.max(0, (audioCurrentTime / audioDuration) * 100)) : 0

      figure.style.setProperty('--audio-progress', `${progress}%`)
      if (current) current.textContent = formatTime(audioCurrentTime)
      if (duration) duration.textContent = formatTime(audioDuration)
      if (wave) {
        wave.setAttribute('aria-valuemax', String(Math.floor(audioDuration)))
        wave.setAttribute('aria-valuenow', String(Math.floor(audioCurrentTime)))
        wave.setAttribute('aria-valuetext', `${formatTime(audioCurrentTime)} of ${formatTime(audioDuration)}`)
      }
    }

    const setAudioTime = (figure: HTMLElement, audio: HTMLAudioElement, nextTime: number) => {
      try {
        audio.currentTime = nextTime
      } catch {
        return false
      }

      updateProgress(figure, audio)
      return true
    }

    const applyPendingSeek = (figure: HTMLElement, audio: HTMLAudioElement) => {
      const pendingSeekRatio = Number(figure.dataset.pendingSeekRatio)
      if (!Number.isFinite(pendingSeekRatio) || !Number.isFinite(audio.duration) || audio.duration <= 0) return

      const boundedRatio = Math.min(1, Math.max(0, pendingSeekRatio))
      const didSeek = setAudioTime(figure, audio, boundedRatio * audio.duration)
      if (didSeek) delete figure.dataset.pendingSeekRatio
    }

    const setPlayingState = (figure: HTMLElement, button: HTMLButtonElement, playing: boolean) => {
      const label = button.querySelector<HTMLElement>('.prose-vibe-audio__load-text')

      figure.dataset.playing = playing ? 'true' : 'false'
      if (label) label.textContent = playing ? 'Pause' : 'Play'
      button.setAttribute('aria-label', playing ? 'Pause audio' : 'Play audio')
    }

    const ensureAudio = (figure: HTMLElement) => {
      const button = figure.querySelector<HTMLButtonElement>('.prose-vibe-audio__load')
      const audio = figure?.querySelector<HTMLAudioElement>('audio.prose-vibe-audio__player')
      const src = button?.dataset.audioSrc
      const type = button?.dataset.audioType

      if (!button || !audio || !src) return null

      if (audio.dataset.loadedSrc !== src) {
        audio.src = src
        if (type) audio.dataset.audioType = type
        audio.dataset.loadedSrc = src

        const syncAudioState = () => {
          applyPendingSeek(figure, audio)
          updateProgress(figure, audio)
        }

        if (audio.dataset.listenersBound !== 'true') {
          audio.addEventListener('pause', () => setPlayingState(figure, button, false))
          audio.addEventListener('ended', () => setPlayingState(figure, button, false))
          audio.addEventListener('play', () => setPlayingState(figure, button, true))
          audio.addEventListener('loadedmetadata', syncAudioState)
          audio.addEventListener('durationchange', syncAudioState)
          audio.addEventListener('canplay', syncAudioState)
          audio.addEventListener('timeupdate', () => updateProgress(figure, audio))
          audio.dataset.listenersBound = 'true'
        }

        audio.load()
      }

      figure.dataset.loaded = 'true'
      applyPendingSeek(figure, audio)
      updateProgress(figure, audio)
      return { audio, button }
    }

    const playAudio = (figure: HTMLElement, audio: HTMLAudioElement, button: HTMLButtonElement) => {
      document.querySelectorAll<HTMLAudioElement>('audio.prose-vibe-audio__player').forEach((otherAudio) => {
        if (otherAudio !== audio) otherAudio.pause()
      })

      void audio
        .play()
        .catch(() => setPlayingState(figure, button, false))
    }

    const seekToRatio = (figure: HTMLElement, ratio: number, shouldPlay: boolean) => {
      const parts = ensureAudio(figure)
      if (!parts) return

      const { audio, button } = parts
      const boundedRatio = Math.min(1, Math.max(0, ratio))

      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setAudioTime(figure, audio, boundedRatio * audio.duration)
        if (shouldPlay) playAudio(figure, audio, button)
        return
      }

      figure.dataset.pendingSeekRatio = String(boundedRatio)
      figure.style.setProperty('--audio-progress', `${boundedRatio * 100}%`)

      if (shouldPlay) {
        playAudio(figure, audio, button)
      }
    }

    const toggleAudio = (button: HTMLButtonElement) => {
      const figure = button.closest<HTMLElement>('.prose-vibe-audio')
      if (!figure) return

      const parts = ensureAudio(figure)
      if (!parts) return

      const { audio } = parts

      if (!audio.paused) {
        audio.pause()
        return
      }

      playAudio(figure, audio, button)
    }

    const rewindAudio = (button: HTMLButtonElement) => {
      const figure = button.closest<HTMLElement>('.prose-vibe-audio')
      if (!figure) return

      const parts = ensureAudio(figure)
      if (!parts) return

      setAudioTime(figure, parts.audio, Math.max(0, parts.audio.currentTime - 10))
    }

    const onClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof HTMLElement)) return

      const button = target.closest<HTMLButtonElement>('.prose-vibe-audio__load')
      if (button) {
        event.preventDefault()
        toggleAudio(button)
        return
      }

      const rewind = target.closest<HTMLButtonElement>('.prose-vibe-audio__rewind')
      if (rewind) {
        event.preventDefault()
        rewindAudio(rewind)
        return
      }

      const wave = target.closest<HTMLElement>('.prose-vibe-audio__wave')
      const figure = wave?.closest<HTMLElement>('.prose-vibe-audio')
      if (wave && figure) {
        const rect = wave.getBoundingClientRect()
        const ratio = rect.width > 0 ? (event.clientX - rect.left) / rect.width : 0
        event.preventDefault()
        seekToRatio(figure, ratio, true)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target
      if (!(target instanceof HTMLElement) || !target.matches('.prose-vibe-audio__wave')) return

      const figure = target.closest<HTMLElement>('.prose-vibe-audio')
      if (!figure) return

      const parts = ensureAudio(figure)
      if (!parts) return

      const { audio } = parts
      const duration = Number.isFinite(audio.duration) ? audio.duration : 0
      let nextTime: number | null = null

      if (event.key === 'ArrowLeft') nextTime = audio.currentTime - 5
      if (event.key === 'ArrowRight') nextTime = audio.currentTime + 5
      if (event.key === 'Home') nextTime = 0
      if (event.key === 'End' && duration > 0) nextTime = duration

      if (nextTime === null) return

      event.preventDefault()
      setAudioTime(figure, audio, Math.min(duration || Number.POSITIVE_INFINITY, Math.max(0, nextTime)))
    }

    document.addEventListener('click', onClick)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return null
}
