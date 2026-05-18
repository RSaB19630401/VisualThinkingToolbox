// SettingsTool.jsx — Settings: Dark Mode, Language, Sharing
import React, { useState } from 'react';
import { FONT_CSS } from './primitives.js';
import { useSettings, setDark, setLang } from './settings.js';

const ST = {
  de: {
    title: 'Einstellungen', sub: 'Darstellung, Sprache und Teilen',
    darkMode: 'Dark Mode', darkDesc: 'Dunkles Design für alle Tools.',
    langTitle: 'Standardsprache', langDesc: 'Wird beim nächsten Öffnen eines Tools übernommen.',
    shareTitle: 'Teilen & Exportieren',
    shareDesc: 'Jedes Tool hat eigene SVG/PNG/JSON-Export-Buttons. JSON-Dateien können über „Projekt laden" wieder importiert werden.',
    shareTip: 'Tipp: Exportiere als PNG für Social Media, als SVG für Druckqualität, als JSON zum Weiterarbeiten.',
    about: 'Über', aboutText: 'Visual Thinking Toolbox v2.0 — KI-gestützte Visual-Thinking-Tools im Bikablo-Stil. Erstellt mit React + Claude API.',
    on: 'AN', off: 'AUS',
  },
  en: {
    title: 'Settings', sub: 'Appearance, Language and Sharing',
    darkMode: 'Dark Mode', darkDesc: 'Dark theme for all tools.',
    langTitle: 'Default Language', langDesc: 'Applied when opening a tool.',
    shareTitle: 'Share & Export',
    shareDesc: 'Each tool has its own SVG/PNG/JSON export buttons. JSON files can be re-imported via "Load Project".',
    shareTip: 'Tip: Export as PNG for social media, SVG for print quality, JSON to continue working.',
    about: 'About', aboutText: 'Visual Thinking Toolbox v2.0 — AI-powered visual thinking tools in Bikablo style. Built with React + Claude API.',
    on: 'ON', off: 'OFF',
  },
  ru: {
    title: 'Настройки', sub: 'Оформление, язык и обмен',
    darkMode: 'Тёмная тема', darkDesc: 'Тёмное оформление для всех инструментов.',
    langTitle: 'Язык по умолчанию', langDesc: 'Применяется при открытии инструмента.',
    shareTitle: 'Поделиться и экспорт',
    shareDesc: 'Каждый инструмент имеет кнопки экспорта SVG/PNG/JSON. JSON-файлы можно повторно импортировать.',
    shareTip: 'Совет: PNG для соцсетей, SVG для печати, JSON для продолжения работы.',
    about: 'О программе', aboutText: 'Visual Thinking Toolbox v2.0 — ИИ-инструменты визуального мышления в стиле Бикабло.',
    on: 'ВКЛ', off: 'ВЫКЛ',
  },
};

function Toggle({ value, onChange, labelOn, labelOff }) {
  return (
    <button onClick={() => onChange(!value)} style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '8px 18px', borderRadius: 24,
      border: `2px solid ${value ? '#4CAF50' : '#ccc'}`,
      background: value ? '#4CAF50' : '#f0f0f0',
      color: value ? '#fff' : '#888',
      fontFamily: 'Caveat,cursive', fontSize: 17, fontWeight: 700,
      cursor: 'pointer', transition: 'all 0.2s ease',
    }}>
      <span style={{
        width: 22, height: 22, borderRadius: '50%',
        background: value ? '#fff' : '#ccc',
        transition: 'all 0.2s ease',
        boxShadow: value ? '0 0 6px rgba(76,175,80,0.4)' : 'none',
      }}/>
      {value ? labelOn : labelOff}
    </button>
  );
}

function Section({ title, children, color = '#2D2D2D', dark }) {
  return (
    <div style={{
      padding: 20, borderRadius: 14,
      border: `2px solid ${dark ? '#333' : '#e0e0e0'}`,
      background: dark ? '#1E1E36' : '#fff',
      marginBottom: 16,
    }}>
      <h3 style={{ fontFamily: 'Caveat,cursive', fontSize: 20, fontWeight: 700, color, margin: '0 0 12px' }}>{title}</h3>
      {children}
    </div>
  );
}

export default function SettingsTool() {
  const { dark, lang } = useSettings();
  const t = ST[lang] || ST.de;
  const textCol = dark ? '#E8E8E8' : '#2D2D2D';
  const subCol = dark ? '#999' : '#888';
  const bgGrad = dark
    ? 'linear-gradient(145deg, #12122A 0%, #1A1A2E 100%)'
    : 'linear-gradient(145deg, #FEFCFB 0%, #F5F0EB 100%)';

  return (
    <div style={{ minHeight: '100vh', background: bgGrad }}>
      <style>{FONT_CSS}</style>
      <div style={{ textAlign: 'center', padding: '16px 16px 3px' }}>
        <h1 style={{ fontFamily: 'Caveat,cursive', fontSize: 30, fontWeight: 700, color: textCol, margin: 0 }}>⚙️ {t.title}</h1>
        <p style={{ fontFamily: 'Patrick Hand,cursive', fontSize: 13, color: subCol, marginTop: 2 }}>{t.sub}</p>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: 20 }}>

        {/* Dark Mode */}
        <Section title={`🌓 ${t.darkMode}`} dark={dark} color={dark ? '#5B9BD5' : '#2D2D2D'}>
          <p style={{ fontFamily: 'Patrick Hand,cursive', fontSize: 14, color: subCol, marginBottom: 14 }}>{t.darkDesc}</p>
          <Toggle value={dark} onChange={setDark} labelOn={t.on} labelOff={t.off}/>
        </Section>

        {/* Language */}
        <Section title={`🌐 ${t.langTitle}`} dark={dark} color={dark ? '#5B9BD5' : '#2D2D2D'}>
          <p style={{ fontFamily: 'Patrick Hand,cursive', fontSize: 14, color: subCol, marginBottom: 14 }}>{t.langDesc}</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {[['de', '🇩🇪 Deutsch'], ['en', '🇬🇧 English'], ['ru', '🇷🇺 Русский']].map(([k, label]) => (
              <button key={k} onClick={() => setLang(k)} style={{
                flex: 1, padding: '10px 14px', borderRadius: 12,
                border: lang === k ? '2px solid #4CAF50' : `2px solid ${dark ? '#444' : '#e0e0e0'}`,
                background: lang === k ? (dark ? '#2A3A2A' : '#F0FFF0') : (dark ? '#1A1A2E' : '#FAFAFA'),
                color: lang === k ? '#4CAF50' : (dark ? '#aaa' : '#666'),
                fontFamily: 'Patrick Hand,cursive', fontSize: 15,
                cursor: 'pointer', fontWeight: lang === k ? 700 : 400,
              }}>{label}</button>
            ))}
          </div>
        </Section>

        {/* Sharing */}
        <Section title={`📤 ${t.shareTitle}`} dark={dark} color={dark ? '#5B9BD5' : '#2D2D2D'}>
          <p style={{ fontFamily: 'Patrick Hand,cursive', fontSize: 14, color: subCol, marginBottom: 8 }}>{t.shareDesc}</p>
          <div style={{
            padding: '12px 16px', borderRadius: 10,
            background: dark ? '#242445' : '#F0F8FF',
            border: `1px solid ${dark ? '#333' : '#D0E4F5'}`,
            fontFamily: 'Patrick Hand,cursive', fontSize: 14, color: dark ? '#AAC4E0' : '#3B7DD8', lineHeight: 1.6,
          }}>
            💡 {t.shareTip}
          </div>
        </Section>

        {/* About */}
        <Section title={`ℹ️ ${t.about}`} dark={dark} color={dark ? '#5B9BD5' : '#2D2D2D'}>
          <p style={{ fontFamily: 'Patrick Hand,cursive', fontSize: 14, color: subCol, lineHeight: 1.6 }}>{t.aboutText}</p>
          <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['✏️ Sketchnote', '🧠 Mind-Map', '🔄 Vorher/Nachher', '◆ Wertequadrat'].map(tool => (
              <span key={tool} style={{
                padding: '4px 12px', borderRadius: 8,
                background: dark ? '#2A2A4A' : '#F5F0EB',
                fontFamily: 'Caveat,cursive', fontSize: 14, color: dark ? '#B0B0D0' : '#888',
              }}>{tool}</span>
            ))}
          </div>
        </Section>

      </div>
    </div>
  );
}
