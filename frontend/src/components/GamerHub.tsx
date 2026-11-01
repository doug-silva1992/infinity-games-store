import { CONQUISTAS, JOGADOR, RANKING, XP_POR_NIVEL } from '../data/perfil'
import { jogoPorId } from '../data/jogos'
import { useStore } from '../store/useStore'
import { brl, desconto, normalizar, numero } from '../utils/format'
import Avatar from './Avatar'
import BuyButton from './BuyButton'
import { DragonMascot } from './Dragon'
import GameCover from './GameCover'
import Icon from './Icon'
import './GamerHub.css'

const posicaoNoRanking = (xp: number) => RANKING.filter((r) => r.xp > xp).length + 1
const POSICAO_INICIAL = posicaoNoRanking(JOGADOR.xpInicial)

// Central do Jogador: nível/XP, conquistas, ranking da comunidade e lista de desejos
function GamerHub() {
  const { nivel, xp, xpNoNivel, conquistas, biblioteca, desejos, alternarDesejo, abrirJogo } = useStore()
  const progresso = xpNoNivel / XP_POR_NIVEL
  const posicao = posicaoNoRanking(xp)
  const subiu = POSICAO_INICIAL - posicao
  const ranking = [...RANKING, { gamertag: JOGADOR.gamertag, xp, voce: true }].sort((a, b) => b.xp - a.xp)
  const listaDesejos = [...desejos].map(jogoPorId)

  return (
    <section className="section" id="central">
      <div className="section-head">
        <div>
          <span className="section-kicker">Sua jornada</span>
          <h2 className="section-title">Central do Jogador</h2>
          <p className="section-sub">Cada compra rende XP, desbloqueia conquistas e te leva mais alto no ranking da comunidade.</p>
        </div>
      </div>

      <div className="hub">
        {/* Perfil e nível */}
        <article className="hub-panel hub-profile">
          <div className="hub-profile-top">
            <Avatar nome={JOGADOR.gamertag} size={96} progresso={progresso} dragao />
            <div>
              <span className="hub-tag">{JOGADOR.titulo}</span>
              <h3>{JOGADOR.gamertag}</h3>
              <small>Membro desde {JOGADOR.membroDesde}</small>
            </div>
          </div>
          <div className="hub-level">
            <span className="hub-level-badge">
              <small>Nível</small>
              <strong key={nivel}>{nivel}</strong>
            </span>
            <div className="hub-xp">
              <div className="hub-xp-labels">
                <span>{numero(xpNoNivel)} XP</span>
                <span>{numero(XP_POR_NIVEL - xpNoNivel)} para o nível {nivel + 1}</span>
              </div>
              <div className="hub-xp-bar">
                <span style={{ width: `${progresso * 100}%` }} />
              </div>
              <small>{numero(xp)} XP acumulado</small>
            </div>
          </div>
          <div className="hub-stats">
            <div>
              <strong>{biblioteca.size}</strong>
              <span>Jogos</span>
            </div>
            <div>
              <strong>{numero(JOGADOR.horasJogadas)}h</strong>
              <span>Jogadas</span>
            </div>
            <div>
              <strong>#{posicao}</strong>
              <span>Ranking</span>
            </div>
          </div>
        </article>

        {/* Conquistas */}
        <article className="hub-panel hub-achievements" id="conquistas">
          <div className="hub-panel-head">
            <h3>
              <Icon name="trophy" size={18} /> Conquistas
            </h3>
            <span>
              {conquistas.size}/{CONQUISTAS.length}
            </span>
          </div>
          <div className="hub-progress">
            <span style={{ width: `${(conquistas.size / CONQUISTAS.length) * 100}%` }} />
          </div>
          <ul className="achievements">
            {CONQUISTAS.map((c) => {
              const obtida = conquistas.has(c.id)
              return (
                <li
                  key={c.id}
                  className={`achievement rarity-${normalizar(c.raridade)} ${obtida ? 'unlocked' : ''}`}
                  tabIndex={0}
                >
                  <span className="achievement-icon">
                    {c.id === 'dragao' && obtida ? <DragonMascot size={30} /> : <Icon name={obtida ? c.icone : 'lock'} size={20} />}
                  </span>
                  <span className="achievement-name">
                    <strong>{c.nome}</strong>
                    <small>{c.raridade}</small>
                  </span>
                  <span className="achievement-tip" role="tooltip">
                    <strong>{c.nome}</strong>
                    <span>{c.descricao}</span>
                    <small>
                      {c.raridade} · +{c.xp} XP
                    </small>
                  </span>
                </li>
              )
            })}
          </ul>
        </article>

        {/* Ranking */}
        <article className="hub-panel hub-ranking" id="ranking">
          <div className="hub-panel-head">
            <h3>
              <Icon name="trendingUp" size={18} /> Ranking da comunidade
            </h3>
            {subiu > 0 && <span className="hub-up">▲ {subiu}</span>}
          </div>
          <ol className="ranking">
            {ranking.map((r, i) => (
              <li key={r.gamertag} className={`${'voce' in r ? 'me' : ''} ${i < 3 ? `top top-${i + 1}` : ''}`}>
                <span className="ranking-pos">{i + 1}</span>
                <Avatar nome={r.gamertag} size={32} dragao={'voce' in r} />
                <span className="ranking-name">
                  {r.gamertag}
                  {'voce' in r && <small>você</small>}
                </span>
                <span className="ranking-xp">{numero(r.xp)} XP</span>
              </li>
            ))}
          </ol>
        </article>

        {/* Lista de desejos */}
        <article className="hub-panel hub-wishlist" id="desejos">
          <div className="hub-panel-head">
            <h3>
              <Icon name="heart" size={18} /> Lista de desejos
            </h3>
            <span>{listaDesejos.length}</span>
          </div>
          {listaDesejos.length === 0 ? (
            <div className="hub-empty">
              <DragonMascot size={56} />
              <p>Sua lista está vazia. Toque no ♥ de qualquer jogo para guardar aqui.</p>
            </div>
          ) : (
            <ul className="wishlist">
              {listaDesejos.map((jogo) => (
                <li key={jogo.id}>
                  <button className="wishlist-thumb" onClick={() => abrirJogo(jogo)} aria-label={`Ver detalhes de ${jogo.titulo}`}>
                    <GameCover jogo={jogo} logo={false} />
                  </button>
                  <div className="wishlist-info">
                    <strong>{jogo.titulo}</strong>
                    <span>
                      {desconto(jogo) > 0 && <span className="badge badge-off">-{desconto(jogo)}%</span>}
                      {brl(jogo.preco)}
                    </span>
                  </div>
                  <BuyButton jogo={jogo} />
                  <button className="wishlist-remove" onClick={() => alternarDesejo(jogo)} aria-label={`Remover ${jogo.titulo} da lista de desejos`}>
                    <Icon name="x" size={15} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>
    </section>
  )
}

export default GamerHub
