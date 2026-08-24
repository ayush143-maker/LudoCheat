import Modal from './Modal';
import { Dice5, Footprints, Target, Trophy } from 'lucide-react';

const steps = [
  { icon: Dice5, title: 'Roll the dice', text: 'Tap ROLL or the dice itself.' },
  { icon: Footprints, title: 'Move tokens', text: 'A 6 takes a token out of base.' },
  { icon: Target, title: 'Capture', text: 'Land on a rival to send it home. Stars are safe.' },
  { icon: Trophy, title: 'Win', text: 'Get all 4 tokens to the center.' },
];

export default function HowToModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title="How To Play">
      <div className="howto-list">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div key={step.title} className="howto-card">
              <div className="howto-icon">
                <Icon size={20} />
              </div>
              <div>
                <strong>
                  {index + 1}. {step.title}
                </strong>
                <p className="muted small">{step.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
