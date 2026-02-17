import { Brain, Sparkles, FileText, BarChart3, Shield, Users, Check, Star, ArrowLeft, Zap, BookOpen, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 right-0 left-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">الاستبيانات الذكية</span>
          </div>
          <Link
            to="/categories"
            className="gradient-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-glow flex items-center gap-2"
          >
            ابدأ الآن
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="gradient-hero pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-primary blur-3xl" />
          <div className="absolute bottom-10 left-20 w-96 h-96 rounded-full bg-primary blur-3xl" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">مدعوم بالذكاء الاصطناعي</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-primary-foreground leading-tight mb-6">
              أنشئ اختباراتك بذكاء
              <br />
              <span className="text-gradient">في ثوانٍ معدودة</span>
            </h1>
            <p className="text-lg text-primary-foreground/70 mb-10 max-w-xl mx-auto leading-relaxed">
              منصة متكاملة لإنشاء الأسئلة والاختبارات باستخدام الذكاء الاصطناعي.
              ارفع ملفاتك ودع الذكاء الاصطناعي يولد أسئلة متنوعة تلقائياً.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                to="/categories"
                className="gradient-primary text-primary-foreground px-8 py-3.5 rounded-xl text-base font-bold hover:opacity-90 transition-opacity shadow-glow flex items-center gap-2"
              >
                ابدأ مجاناً
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <a
                href="#features"
                className="bg-primary-foreground/10 text-primary-foreground border border-primary-foreground/20 px-8 py-3.5 rounded-xl text-base font-medium hover:bg-primary-foreground/20 transition-colors"
              >
                اكتشف المزيد
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '+10,000', label: 'سؤال تم إنشاؤه' },
              { value: '+500', label: 'مستخدم نشط' },
              { value: '+200', label: 'اختبار منشور' },
              { value: '99%', label: 'رضا المستخدمين' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-black text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-foreground mb-4">مميزات تجعلنا مختلفين</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">أدوات ذكية تساعدك في إنشاء اختبارات احترافية بسهولة</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Sparkles, title: 'توليد ذكي للأسئلة', desc: 'ارفع ملفاتك ودع الذكاء الاصطناعي يولد أسئلة متنوعة: صح/خطأ، اختيارات، ترتيب، وأكثر.' },
              { icon: BookOpen, title: 'أنواع أسئلة متعددة', desc: 'دعم لست أنواع من الأسئلة: صح/خطأ، نعم/لا، اختيار من متعدد، أكمل الفراغ، ترتيب، ومطابقة.' },
              { icon: FileText, title: 'إدارة الاختبارات', desc: 'أنشئ اختبارات بإعدادات مرنة: وقت محدد، ترتيب عشوائي، درجات سالبة، ومشاركة عامة.' },
              { icon: BarChart3, title: 'تحليل الأداء', desc: 'لوحة تحكم شاملة لمتابعة نتائج الطلاب وتحليل أدائهم في الاختبارات.' },
              { icon: Shield, title: 'خصوصية وأمان', desc: 'تحكم كامل في خصوصية المحتوى مع خيارات عرض عامة وخاصة.' },
              { icon: Users, title: 'إدارة المستخدمين', desc: 'تتبع إجابات الطلاب مع تسجيل بياناتهم ونتائجهم بشكل منظم.' },
            ].map((feature) => (
              <div key={feature.title} className="gradient-card rounded-2xl p-6 border border-border hover:shadow-lg hover:border-primary/30 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:gradient-primary group-hover:shadow-glow transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-foreground mb-4">خطط الأسعار</h2>
            <p className="text-muted-foreground">اختر الخطة المناسبة لاحتياجاتك</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                name: 'مجاني',
                price: '0',
                features: ['50 سؤال شهرياً', 'اختباران', 'تحليل أساسي', 'دعم مجتمعي'],
                popular: false,
              },
              {
                name: 'احترافي',
                price: '49',
                features: ['أسئلة غير محدودة', 'اختبارات غير محدودة', 'تحليل متقدم', 'دعم أولوية', 'توليد AI متقدم'],
                popular: true,
              },
              {
                name: 'مؤسسات',
                price: '199',
                features: ['كل مميزات الاحترافي', 'مستخدمون متعددون', 'API مخصص', 'دعم مخصص 24/7', 'تخصيص كامل'],
                popular: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 border transition-all duration-300 ${
                  plan.popular
                    ? 'gradient-primary text-primary-foreground border-transparent shadow-glow scale-105'
                    : 'bg-card border-border hover:border-primary/30'
                }`}
              >
                {plan.popular && (
                  <div className="flex items-center gap-1 mb-4">
                    <Star className="w-4 h-4" />
                    <span className="text-xs font-bold">الأكثر شعبية</span>
                  </div>
                )}
                <h3 className={`text-xl font-bold mb-2 ${plan.popular ? '' : 'text-foreground'}`}>{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black">{plan.price}</span>
                  <span className={`text-sm ${plan.popular ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}> ر.س/شهرياً</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className={`w-4 h-4 flex-shrink-0 ${plan.popular ? '' : 'text-primary'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-xl text-sm font-bold transition-colors ${
                    plan.popular
                      ? 'bg-primary-foreground text-primary hover:bg-primary-foreground/90'
                      : 'bg-primary text-primary-foreground hover:opacity-90'
                  }`}
                >
                  اختر الخطة
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-foreground mb-4">آراء المستخدمين</h2>
            <p className="text-muted-foreground">ماذا يقول مستخدمونا عن المنصة</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: 'د. أحمد الراشد', role: 'أستاذ جامعي', text: 'المنصة وفرت عليّ ساعات من إعداد الأسئلة. توليد الأسئلة بالذكاء الاصطناعي دقيق ومتنوع.' },
              { name: 'سارة المحمد', role: 'معلمة ثانوية', text: 'أفضل أداة لإنشاء الاختبارات. تنوع أنواع الأسئلة وسهولة الاستخدام تجعلها مثالية.' },
              { name: 'م. خالد العتيبي', role: 'مدرب تقني', text: 'تحليل أداء الطلاب ساعدني في تحسين محتوى الدورات التدريبية بشكل كبير.' },
            ].map((testimonial) => (
              <div key={testimonial.name} className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 text-warning fill-warning" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">"{testimonial.text}"</p>
                <div>
                  <p className="text-sm font-bold text-foreground">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="gradient-hero rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-primary blur-3xl" />
            </div>
            <div className="relative z-10">
              <Award className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-black text-primary-foreground mb-4">مستعد للبدء؟</h2>
              <p className="text-primary-foreground/70 mb-8 max-w-md mx-auto">انضم لآلاف المعلمين والمدربين الذين يستخدمون منصتنا لإنشاء اختبارات احترافية</p>
              <Link
                to="/categories"
                className="inline-flex items-center gap-2 gradient-primary text-primary-foreground px-8 py-3.5 rounded-xl text-base font-bold hover:opacity-90 transition-opacity shadow-glow"
              >
                ابدأ الآن مجاناً
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground">© 2024 منصة الاستبيانات الذكية. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
