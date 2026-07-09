export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-dark-900 text-white pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-4xl font-bold mb-8">Политика конфиденциальности</h1>
        <div className="space-y-8 text-sm text-white/60 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. Сбор данных</h2>
            <p>Мы собираем только те данные, которые вы добровольно предоставляете при заполнении формы обратной связи: имя, email, тип съёмки и сообщение. Эти данные используются исключительно для связи с вами по вашему запросу.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. Использование данных</h2>
            <p>Собранные данные используются только для: ответа на ваши запросы, отправки коммерческого предложения. Мы не передаём, не продаём и не публикуем ваши персональные данные третьим лицам.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. Файлы cookie</h2>
            <p>Сайт может использовать файлы cookie для улучшения пользовательского опыта. Вы можете отключить cookies в настройках вашего браузера.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. Аналитика</h2>
            <p>Для улучшения работы сайта мы используем системы аналитики, которые собирают анонимизированные данные о посещаемости. Личные данные через системы аналитики не собираются.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. Ваши права</h2>
            <p>Вы имеете право запросить удаление ваших данных. Для этого напишите на hello@artisan.photo</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-white mb-3">6. Контакт</h2>
            <p>По всем вопросам, связанным с обработкой персональных данных, обращайтесь: hello@artisan.photo</p>
          </section>
        </div>
      </div>
    </main>
  );
}
