import React from 'react';
import { ChevronLeft, ExternalLink, BookOpen } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import MobileLayout from '../components/MobileLayout';

const TOPIC_CONFIG = {
	'diabetes-types': {
		title: 'ชนิดของเบาหวาน',
		subtitle: 'ทำความเข้าใจเบาหวานประเภทต่างๆ',
		src: 'https://heyzine.com/flip-book/c69ba3ecf4.html',
	},
	'diabetes-signs': {
		title: 'อาการและสัญญาณ',
		subtitle: 'สังเกตสัญญาณเตือนของโรค',
		src: 'https://heyzine.com/flip-book/c69ba3ecf4.html',
	},
	'carb-counting': {
		title: 'การนับคาร์โบไฮเดรต',
		subtitle: 'เทคนิคควบคุมระดับน้ำตาลด้วยการนับคาร์บ',
		src: 'https://heyzine.com/flip-book/6f0bc38207.html',
	},
	'exercise': {
		title: 'การออกกำลังกาย',
		subtitle: 'แนวทางการออกกำลังกายที่เหมาะกับผู้ป่วยเบาหวาน',
		src: 'https://heyzine.com/flip-book/dcd344352f.html',
	},
};

const FALLBACK_TOPIC = {
	title: 'ความรู้สุขภาพ',
	subtitle: 'คู่มือสำหรับดูแลสุขภาพประจำวัน',
	src: 'https://heyzine.com/flip-book/c69ba3ecf4.html',
};

const HealthKnowledgeReaderPage = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const topicKey = searchParams.get('topic') || '';
	const topic = TOPIC_CONFIG[topicKey] || FALLBACK_TOPIC;

	const handleBack = () => {
		navigate('/health', { replace: true });
	};

	return (
		<MobileLayout>
			<div className="bg-white p-4 pt-safe-top flex items-center justify-between sticky top-0 z-10 border-b border-slate-100">
				<button onClick={handleBack} className="p-2 -ml-2 text-slate-800 hover:bg-slate-50 rounded-full">
					<ChevronLeft size={24} />
				</button>
				<h1 className="text-base font-bold text-slate-800">อ่านความรู้สุขภาพ</h1>
				<button
					className="p-2 -mr-2 text-slate-500 hover:bg-slate-50 rounded-full"
					onClick={() => window.open(topic.src, '_blank', 'noopener,noreferrer')}
					aria-label="เปิดในแท็บใหม่"
				>
					<ExternalLink size={18} />
				</button>
			</div>

			<div className="flex-1 overflow-y-auto px-4 pb-6 pt-4 no-scrollbar bg-[#F8FAFC]">
				<div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm mb-4">
					<div className="flex items-start gap-3">
						<div className="w-10 h-10 rounded-xl bg-cyan-50 text-[#55BCC3] flex items-center justify-center shrink-0">
							<BookOpen size={18} />
						</div>
						<div>
							<h2 className="text-sm font-bold text-slate-800 leading-tight">{topic.title}</h2>
							<p className="text-xs text-slate-500 mt-1">{topic.subtitle}</p>
						</div>
					</div>
				</div>

				<div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
					<div className="h-[72vh] min-h-[480px] w-full bg-slate-100">
						<iframe
							title={topic.title}
							src={topic.src}
							className="w-full h-full"
							allowFullScreen
							loading="lazy"
						/>
					</div>
				</div>
			</div>
		</MobileLayout>
	);
};

export default HealthKnowledgeReaderPage;
