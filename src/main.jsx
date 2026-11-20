import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Menu, X, Star, MapPin, Phone, Clock3, Instagram, Send, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import './style.css';

const MAP_URL = 'https://yandex.ru/maps/org/bonicolor/195760941171/?ll=49.089795%2C55.813951&z=16';
const REVIEWS_URL = 'https://yandex.ru/maps/org/bonicolor/195760941171/reviews/';
const PHONE = '+7 (987) 290-80-40';
const photos = [
  { src: 'https://avatars.mds.yandex.net/get-altay/13790728/2a00000193d4e4eadfc8c56e34805ee9c3b4/XXL_height', title: 'Холодный шоколад', tag: 'Уход и блеск' },
  { src: 'https://avatars.mds.yandex.net/get-altay/16457969/2a0000019a213bd548da254d3109c9a8add0/S', title: 'Мягкий блонд', tag: 'Окрашивание' },
  { src: 'https://avatars.mds.yandex.net/get-altay/16329243/2a0000019c4118950f81de233961945c9d9f/S', title: 'Глубина оттенка', tag: 'Уход за длиной' },
  { src: 'https://avatars.mds.yandex.net/get-altay/16157592/2a0000019a6fa1b85692a9ef07630d5090d9/S', title: 'Трансформация блонда', tag: 'До / после' },
  { src: 'https://avatars.mds.yandex.net/get-altay/15366886/2a0000019570ae7b1d263b95ce22fd0bd253/S', title: 'Естественная текстура', tag: 'Стрижка' },
];
const services = [
  ['01', 'Сложное окрашивание', 'AirTouch · мелирование · омбре'],
  ['02', 'Окрашивание и тонирование', 'Работа с оттенком и глубиной цвета'],
  ['03', 'Восстановление волос', 'Холодное восстановление · уход'],
  ['04', 'Кератин и нанопластика', 'Гладкость, блеск и дисциплина волос'],
  ['05', 'Стрижки и укладки', 'Форма, которая подчёркивает вас'],
  ['06', 'Завивка и локоны', 'Мягкая текстура и объём'],
];
const reviews = [
  { name: 'Карина Гущина', date: '18 июля', text: 'Очень долго сомневалась насчёт стрижки, но после визита к Ольге осталась в восторге. Мастер рассказала, как лучше укладывать волосы и ухаживать за ними. Результат получился именно таким, как хотелось.', topic: 'Стрижка', stars: 5 },
  { name: 'Станислава', date: '26 октября 2025', text: 'Ольга сотворила волшебство. Цена была названа заранее, каждый шаг мастер подробно объясняла. Очень приятная атмосфера, чистота, уют и приятные беседы. Однозначно хочется вернуться.', topic: 'Окрашивание', stars: 5 },
  { name: 'Илюза Зайнуллина', date: '11 апреля', text: 'Холодное восстановление волос прошло идеально. Волосы теперь выглядят живыми, блестящими и невероятно ухоженными. Богдана — внимательный мастер своего дела.', topic: 'Восстановление', stars: 5 },
  { name: 'Арина Мусина', date: '11 ноября 2025', text: 'Мне сделали лучшее окрашивание в жизни. Нейтрализовали желтизну и получили красивый блонд. Большое спасибо мастеру Ольге!', topic: 'Блонд', stars: 5 },
];
const reveal = { hidden: { opacity: 0, y: 34 }, show: { opacity: 1, y: 0, transition: { duration: .75, ease: [0.22, 1, 0.36, 1] } } };

function App() {
  const [menu, setMenu] = useState(false);
  const [activePhoto, setActivePhoto] = useState(null);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [specialist, setSpecialist] = useState('Не знаю, помогите выбрать');
  const [bookingService, setBookingService] = useState('Сложное окрашивание');
  const [priceCategory, setPriceCategory] = useState('haircuts');
  const scrollFrame = useRef(null);

  // Reversible reveal observer for the full page, including price rows
  // that are replaced when the user switches price categories.
  useEffect(() => {
    const selectors = [
      '.section-kicker', '.intro-content > *', '.stats > *',
      '.services-head > *', '.service-row', '.services-foot > *',
      '.works-head > *', '.gallery-item', '.gallery-source',
      '.price-head > *', '.price-tabs', '.price-row', '.price-bottom > *',
      '.quote-band > *', '.reviews-layout > *', '.review-disclaimer',
      '.team-content > *', '.team-note', '.contact-head > *',
      '.contact-grid > *', '.footer > *'
    ];
    const selector = selectors.join(',');
    const observed = new WeakSet();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting);
      });
    }, { root: null, rootMargin: '-5% 0px -5% 0px', threshold: 0.01 });

    const register = (root) => {
      const elements = [];
      if (root instanceof Element && root.matches(selector)) elements.push(root);
      if (root.querySelectorAll) elements.push(...root.querySelectorAll(selector));
      elements.forEach((element) => {
        if (observed.has(element)) return;
        observed.add(element);
        element.classList.add('scroll-reveal');
        observer.observe(element);
      });
    };

    register(document);
    const mutations = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) register(node);
      }));
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);
  const { scrollYProgress } = useScroll();
  const progress = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const nextReview = (dir) => setReviewIndex((v) => (v + dir + reviews.length) % reviews.length);
  const scrollToSection = (event, target) => {
    event.preventDefault();
    setMenu(false);
    const section = document.querySelector(target);
    if (!section) return;

    // Drive the scroll ourselves so it is consistently animated even if the
    // browser or OS overrides native smooth-scrolling preferences.
    if (scrollFrame.current !== null) cancelAnimationFrame(scrollFrame.current);
    const header = document.querySelector('.header');
    const headerOffset = (header?.getBoundingClientRect().height || 0) + 18;
    const startY = window.scrollY;
    const targetY = Math.max(0, startY + section.getBoundingClientRect().top - headerOffset);
    const distance = targetY - startY;
    const duration = Math.min(850, Math.max(420, Math.abs(distance) * 0.42));
    const startTime = performance.now();

    const animateScroll = (now) => {
      const progress = Math.min(1, (now - startTime) / duration);
      // Smoothstep easing: quick travel, with a soft start and finish.
      const eased = progress * progress * (3 - 2 * progress);
      window.scrollTo(0, startY + distance * eased);
      if (progress < 1) {
        scrollFrame.current = requestAnimationFrame(animateScroll);
      } else {
        scrollFrame.current = null;
        window.scrollTo(0, targetY);
      }
    };
    scrollFrame.current = requestAnimationFrame(animateScroll);
  };
  const openBooking = () => setBookingOpen(true);
  const bookingMessage = `Здравствуйте! Хочу записаться в Bonicolor.\nСпециалист: ${specialist}.\nУслуга: ${bookingService}.\nПодскажите, пожалуйста, ближайшее свободное время и итоговую стоимость.`;
  const sendBooking = (channel) => {
    const encoded = encodeURIComponent(bookingMessage);
    const url = channel === 'telegram'
      ? `https://t.me/bonicolor?text=${encoded}`
      : `https://wa.me/79872908040?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return <>
    <motion.div className="progress" style={{ scaleX: progress }} />
    <header className="header">
      <a href="#top" className="brand" aria-label="Bonicolor home" onClick={(e)=>scrollToSection(e,'#top')}>BONI<span>COLOR</span><i>®</i></a>
      <nav className="desktop-nav"><a href="#about" onClick={(e)=>scrollToSection(e,'#about')}>О салоне</a><a href="#services" onClick={(e)=>scrollToSection(e,'#services')}>Услуги</a><a href="#works" onClick={(e)=>scrollToSection(e,'#works')}>Работы</a><a href="#price" onClick={(e)=>scrollToSection(e,'#price')}>Прайс</a><a href="#reviews" onClick={(e)=>scrollToSection(e,'#reviews')}>Отзывы</a><a href="#contacts" onClick={(e)=>scrollToSection(e,'#contacts')}>Контакты</a></nav>
      <button className="header-cta" onClick={openBooking}>Записаться <ArrowUpRight size={15}/></button>
      <button className="menu-toggle" onClick={() => setMenu(!menu)} aria-label="Открыть меню">{menu ? <X/> : <Menu/>}</button>
    </header>
    <AnimatePresence>{menu && <motion.div className="mobile-menu" initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}>{[['О салоне','#about'],['Услуги','#services'],['Работы','#works'],['Прайс','#price'],['Отзывы','#reviews'],['Контакты','#contacts']].map(([t,h])=><a key={h} href={h} onClick={(e)=>scrollToSection(e,h)}>{t}<ArrowUpRight size={18}/></a>)}<button onClick={openBooking}>Записаться на визит</button></motion.div>}</AnimatePresence>

    <main id="top">
      <section className="hero">
        <div className="hero-copy">
          <motion.div className="eyebrow" initial="hidden" animate="show" variants={reveal}><span className="eyebrow-dot"/> САЛОН КРАСОТЫ · КАЗАНЬ</motion.div>
          <motion.h1 initial="hidden" animate="show" variants={{...reveal, show:{...reveal.show, transition:{...reveal.show.transition, delay:.12}}}}>Красота<br/>в <em>каждой</em><br/>детали<span className="period">.</span></motion.h1>
          <motion.div className="hero-bottom" initial="hidden" animate="show" variants={{...reveal, show:{...reveal.show, transition:{...reveal.show.transition, delay:.25}}}}>
            <p>Цвет, форма и уход, которые<br/>подчёркивают вашу индивидуальность.</p>
            <a className="circle-link" href="#about" onClick={(e)=>scrollToSection(e,'#about')}><ArrowDown size={19}/></a>
          </motion.div>
          <div className="hero-index"><span>01</span><i/> BEAUTY IS PERSONAL</div>
        </div>
        <motion.div className="hero-image" initial={{clipPath:'inset(0 0 100% 0)'}} animate={{clipPath:'inset(0 0 0% 0)'}} transition={{duration:1.1,ease:[.76,0,.24,1],delay:.15}}>
          <img src={photos[0].src} alt="Работа мастеров Bonicolor — гладкие блестящие волосы" />
          <div className="image-caption"><span>01 / 05</span><span>HAIR ART & CARE</span></div>
          <div className="hero-stamp"><span>YOUR</span><strong>beauty</strong><span>YOUR RULES</span></div>
        </motion.div>
        <div className="hero-side-note">УЛ. СУЛЕЙМАНОВОЙ, 3 <span>55°48'50.2"N 49°05'23.3"E</span></div>
      </section>

      <section className="intro section-pad" id="about">
        <motion.div className="section-kicker" variants={reveal} initial="hidden" whileInView="show" viewport={{once:false, amount:0.12}}><span>01 / О НАС</span><i/></motion.div>
        <div className="intro-content"><motion.h2 variants={reveal} initial="hidden" whileInView="show" viewport={{once:false, amount:0.12}}>Не меняем вас.<br/><em>Раскрываем</em> вас.</motion.h2><motion.div className="intro-text" variants={reveal} initial="hidden" whileInView="show" viewport={{once:false, amount:0.12}}><p>BONICOLOR — пространство, где внимание к деталям становится искусством. Мы верим, что красивые волосы начинаются с диалога, точной работы и заботы.</p><p>От первого знакомства до финального штриха — всё для того, чтобы вы чувствовали себя собой. Только увереннее.</p><a href="#services" className="text-link" onClick={(e)=>scrollToSection(e,'#services')}>ПОЗНАКОМИТЬСЯ С УСЛУГАМИ <ArrowUpRight size={15}/></a></motion.div></div>
        <div className="stats"><div><strong>4.9<span>/5</span></strong><small>РЕЙТИНГ ЯНДЕКС КАРТ</small></div><div><strong>99</strong><small>ОЦЕНОК КЛИЕНТОВ</small></div><div><strong>100<span>%</span></strong><small>ВНИМАНИЕ К ДЕТАЛЯМ</small></div><div className="stats-note">Репутация, которую<br/>создают люди.</div></div>
      </section>

      <section className="services section-pad" id="services">
        <div className="section-kicker"><span>02 / НАПРАВЛЕНИЯ</span><i/></div>
        <div className="services-head"><h2>Услуги, которые<br/><em>чувствуют</em> разницу.</h2><p>Подберём процедуру под состояние волос, ваш ритм жизни и желаемый результат.</p></div>
        <div className="service-list">{services.map(([n,t,d],i)=><motion.div className="service-row" key={n} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:false, amount:0.12}} transition={{delay:i*.06}}><span className="service-num">{n}</span><div><h3>{t}</h3><p>{d}</p></div><ArrowUpRight className="service-arrow"/><span className="service-hover">B</span></motion.div>)}</div>
        <div className="services-foot"><span>* Стоимость и длительность зависят от длины и состояния волос.</span><button className="dark-button" onClick={openBooking}>Обсудить процедуру <ArrowUpRight size={16}/></button></div>
      </section>

      <section className="works section-pad" id="works">
        <div className="section-kicker"><span>03 / ПОРТФОЛИО</span><i/></div>
        <div className="works-head"><h2>Работа говорит<br/><em>сама за себя.</em></h2><p>Несколько результатов из фотогалереи Bonicolor на Яндекс Картах.</p></div>
        <div className="gallery">{photos.map((p,i)=><motion.button className={`gallery-item gallery-${i+1}`} key={p.src} onClick={()=>setActivePhoto(i)} initial={{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:false, amount:0.12}} transition={{duration:.7,delay:i*.08}}><img src={p.src} alt={p.title} loading="lazy"/><span className="gallery-overlay"><small>{p.tag}</small><strong>{p.title}</strong><i><ArrowUpRight size={18}/></i></span></motion.button>)}</div>
        <div className="gallery-source">ФОТОГРАФИИ: <a href={MAP_URL} target="_blank" rel="noreferrer">ЯНДЕКС КАРТЫ <ArrowUpRight size={12}/></a></div>
      </section>

      <section className="price-section section-pad" id="price">
        <div className="section-kicker"><span>04 / СТОИМОСТЬ</span><i/></div>
        <div className="price-head"><div><h2>Прозрачно<br/><em>о важном.</em></h2><p>Ориентиры по стоимости. Точная цена зависит от длины, густоты и состояния волос — мастер подтвердит её до начала процедуры.</p></div><div className="price-aside"><span>PRICE GUIDE</span><strong>01—03</strong><small>ОСНОВНЫЕ КАТЕГОРИИ</small></div></div>
        <div className="price-tabs" role="tablist" aria-label="Категории прайса">
          <button className={priceCategory==='haircuts'?'active':''} onClick={()=>setPriceCategory('haircuts')}>Стрижки</button>
          <button className={priceCategory==='color'?'active':''} onClick={()=>setPriceCategory('color')}>Окрашивание</button>
          <button className={priceCategory==='care'?'active':''} onClick={()=>setPriceCategory('care')}>Уход и процедуры</button>
        </div>
        <AnimatePresence mode="wait">
          <motion.div className="price-list" key={priceCategory} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.25}}>
            {priceCategory==='haircuts' ? <><div className="price-row"><div><strong>Женская стрижка</strong><small>Подбор формы и укладка</small></div><b>1 000–2 000 ₽</b></div><div className="price-row"><div><strong>Мужская стрижка</strong><small>Форма и аккуратная детализация</small></div><b>1 500–2 000 ₽</b></div><div className="price-row"><div><strong>Солярий</strong><small>Вертикальный солярий · за минуту</small></div><b>от 30 ₽</b></div></> : priceCategory==='color' ? <><div className="price-row"><div><strong>Сложное окрашивание</strong><small>AirTouch · мелирование · омбре</small></div><b>По консультации</b></div><div className="price-row"><div><strong>Окрашивание и тонирование</strong><small>Работа с оттенком и глубиной цвета</small></div><b>По консультации</b></div><div className="price-row"><div><strong>Осветление / выход из цвета</strong><small>План процедуры после диагностики</small></div><b>По консультации</b></div></> : <><div className="price-row"><div><strong>Холодное восстановление</strong><small>Уход и работа с качеством волос</small></div><b>По консультации</b></div><div className="price-row"><div><strong>Кератин и нанопластика</strong><small>Гладкость и дисциплина волос</small></div><b>По консультации</b></div><div className="price-row"><div><strong>Завивка и укладки</strong><small>Подбор формы и текстуры</small></div><b>По консультации</b></div></>}
          </motion.div>
        </AnimatePresence>
        <div className="price-bottom"><span>Стоимость стрижек и солярия указана как ориентир по открытой карточке салона. Остальные цены лучше подтвердить у администратора.</span><button className="dark-button" onClick={openBooking}>Уточнить стоимость <ArrowUpRight size={16}/></button></div>
      </section>

      <section className="quote-band"><div className="quote-mark">“</div><p>Красивые волосы — это не тренд.<br/><em>Это ваше ощущение себя.</em></p><span>BONICOLOR · KAZAN</span></section>

      <section className="reviews section-pad" id="reviews">
        <div className="section-kicker"><span>05 / МНЕНИЕ КЛИЕНТОВ</span><i/></div>
        <div className="reviews-layout"><div className="reviews-intro"><div className="rating"><strong>4.9</strong><div><div className="stars">★★★★★</div><small>99 ОЦЕНОК В ЯНДЕКС КАРТАХ</small></div></div><h2>Слова,<br/>которые <em>важны.</em></h2><p>Впечатления клиентов — самая честная часть нашей истории.</p><a className="text-link" href={REVIEWS_URL} target="_blank" rel="noreferrer">ВСЕ ОТЗЫВЫ НА ЯНДЕКСЕ <ArrowUpRight size={15}/></a></div>
          <div className="review-card"><div className="review-top"><span>ОТЗЫВ {String(reviewIndex+1).padStart(2,'0')} / 04</span><span className="stars">★★★★★</span></div><AnimatePresence mode="wait"><motion.div key={reviewIndex} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} transition={{duration:.3}}><blockquote>«{reviews[reviewIndex].text}»</blockquote><div className="review-author"><div className="review-avatar">{reviews[reviewIndex].name.slice(0,1)}</div><div><strong>{reviews[reviewIndex].name}</strong><small>{reviews[reviewIndex].date} · {reviews[reviewIndex].topic}</small></div></div></motion.div></AnimatePresence><div className="review-controls"><button onClick={()=>nextReview(-1)} aria-label="Предыдущий отзыв"><ChevronLeft/></button><button onClick={()=>nextReview(1)} aria-label="Следующий отзыв"><ChevronRight/></button></div></div>
        </div><p className="review-disclaimer">Отзывы приведены с Яндекс Карт; формулировки отдельных отзывов сокращены для удобства чтения. <a href={REVIEWS_URL} target="_blank" rel="noreferrer">Открыть оригиналы.</a></p>
      </section>

      <section className="team section-pad"><div className="section-kicker"><span>06 / МАСТЕРА</span><i/></div><div className="team-content"><h2>В надёжных<br/><em>руках.</em></h2><p>В отзывах клиенты особенно часто благодарят мастеров Ольгу и Богдану за внимательность, бережный подход и умение услышать пожелания.</p><button className="outline-button" onClick={openBooking}>Подобрать мастера <ArrowUpRight size={16}/></button></div><div className="team-note"><Sparkles size={18}/><span>Сначала слушаем.<br/>Потом создаём.</span></div></section>

      <section className="contact section-pad" id="contacts"><div className="section-kicker"><span>07 / МЫ РЯДОМ</span><i/></div><div className="contact-head"><h2>Ваше время<br/><em>для себя.</em></h2><div><p>Будем рады знакомству. Напишите нам — поможем выбрать услугу и удобное время.</p><button className="light-button" onClick={openBooking}>Записаться на визит <ArrowUpRight size={17}/></button></div></div>
        <div className="contact-grid"><div className="contact-details"><div><small>АДРЕС</small><p>Казань, ул. Сулеймановой, 3<br/>1 этаж</p><a href={MAP_URL} target="_blank" rel="noreferrer">ОТКРЫТЬ НА КАРТЕ <ArrowUpRight size={13}/></a></div><div><small>ТЕЛЕФОН</small><a className="contact-phone" href="tel:+79872908040">{PHONE}</a></div><div><small>ГРАФИК РАБОТЫ</small><p>Ежедневно<br/>10:00 — 20:00</p></div><div className="contact-socials"><small>СОЦСЕТИ</small><div className="social-links"><a href="https://wa.me/79872908040" target="_blank" rel="noreferrer">WHATSAPP <ArrowUpRight size={13}/></a><a href="https://t.me/bonicolor" target="_blank" rel="noreferrer">TELEGRAM <ArrowUpRight size={13}/></a></div></div></div>
          <a className="map-card" href={MAP_URL} target="_blank" rel="noreferrer"><iframe title="Расположение Bonicolor на Яндекс Картах" src="https://yandex.ru/map-widget/v1/?ll=49.089795%2C55.813951&z=16&pt=49.089795%2C55.813951%2Cpm2rdm" loading="lazy"/><span className="map-label"><MapPin size={17}/> BONICOLOR <i/><ArrowUpRight size={16}/></span></a></div>
      </section>
    </main>
    <footer className="footer"><a href="#top" className="brand" onClick={(e)=>scrollToSection(e,'#top')}>BONI<span>COLOR</span><i>®</i></a><span>BEAUTY IS PERSONAL.</span><a href={MAP_URL} target="_blank" rel="noreferrer">ЯНДЕКС КАРТЫ <ArrowUpRight size={13}/></a><small>© 2026 BONICOLOR · DEMO CONCEPT</small></footer>

    <AnimatePresence>{bookingOpen && <motion.div className="booking-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onMouseDown={(e)=>{if(e.target===e.currentTarget)setBookingOpen(false)}}>
      <motion.div className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title" initial={{opacity:0,y:24,scale:.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:16,scale:.98}} transition={{duration:.28}}>
        <button className="booking-close" onClick={()=>setBookingOpen(false)} aria-label="Закрыть"><X size={19}/></button>
        <span className="booking-kicker">BONICOLOR · ЗАПИСЬ</span><h2 id="booking-title">Начнём<br/><em>с диалога.</em></h2><p className="booking-lead">Выберите то, что уже знаете. Если сомневаетесь — поможем определиться в сообщении.</p>
        <label>СПЕЦИАЛИСТ</label><div className="booking-options">{['Ольга','Богдана','Не знаю, помогите выбрать'].map(name=><button key={name} className={specialist===name?'selected':''} onClick={()=>setSpecialist(name)}>{name}</button>)}</div>
        <label htmlFor="booking-service">ВИД РАБОТЫ</label><select id="booking-service" value={bookingService} onChange={e=>setBookingService(e.target.value)}><option>Сложное окрашивание</option><option>Окрашивание и тонирование</option><option>Стрижка</option><option>Восстановление волос</option><option>Кератин / нанопластика</option><option>Завивка / укладка</option><option>Солярий</option><option>Нужна консультация</option></select>
        <div className="booking-actions"><button className="booking-submit" onClick={()=>sendBooking('whatsapp')}>Продолжить в WhatsApp <ArrowUpRight size={17}/></button><button className="booking-submit booking-telegram" onClick={()=>sendBooking('telegram')}>Продолжить в Telegram <ArrowUpRight size={17}/></button></div><small className="booking-footnote">Откроется выбранный мессенджер с подготовленным текстом. Отправка произойдёт только после вашего подтверждения.</small>
      </motion.div>
    </motion.div>}</AnimatePresence>

    <AnimatePresence>{activePhoto !== null && <motion.div className="lightbox" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setActivePhoto(null)}><button className="lightbox-close" onClick={()=>setActivePhoto(null)}><X/></button><button className="lightbox-prev" onClick={e=>{e.stopPropagation();setActivePhoto((activePhoto+photos.length-1)%photos.length)}}><ChevronLeft/></button><motion.img key={activePhoto} src={photos[activePhoto].src} initial={{scale:.94,opacity:0}} animate={{scale:1,opacity:1}} onClick={e=>e.stopPropagation()}/><button className="lightbox-next" onClick={e=>{e.stopPropagation();setActivePhoto((activePhoto+1)%photos.length)}}><ChevronRight/></button><div className="lightbox-caption">{photos[activePhoto].title} · {activePhoto+1}/{photos.length}</div></motion.div>}</AnimatePresence>
  </>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
