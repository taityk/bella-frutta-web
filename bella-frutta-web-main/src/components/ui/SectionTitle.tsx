type Props = {
  label: string   // 英字ラベル（例: "CONCEPT"）
  title: string   // メイン見出し（日本語）
  center?: boolean
}

export function SectionTitle({ label, title, center = false }: Props) {
  return (
    <div className={`mb-10 ${center ? 'text-center' : ''}`}>
      <p
        className="text-xs tracking-[0.2em] uppercase mb-3"
        style={{ color: 'var(--bf-gold)' }}
      >
        {label}
      </p>
      <h2
        className="text-2xl md:text-3xl tracking-[0.05em] leading-snug"
        style={{ color: 'var(--bf-ink)', fontFamily: '"Noto Serif JP", serif' }}
      >
        {title}
      </h2>
    </div>
  )
}
