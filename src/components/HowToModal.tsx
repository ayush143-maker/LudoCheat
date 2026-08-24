import Modal from './Modal';
import { Dice5, Footprints, Target, Trophy } from 'lucide-react';

const steps = [
  {
    icon: Dice5,
    title: 'Roll',
    text: 'Tap ROLL to throw the dice.',
  },
  {
    icon: Footprints,
    title: 'Move',
    text: 'Use a 6 to leave base, then move along the path.',
  },
  {
    icon: Target,
    title: 'Capture',
    text: 'Land on an opponent token to send it home. Safe cells protect tokens.',
  },
  {
    icon: Trophy,
    title: 'Win',
    text: 'Bring all four tokens to the center to win.',
  },
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
        {steps.map((step) => {
          const Icon = step.icon;

          return (
            <div key={step.title} className="howto-card">
              <div className="howto-icon">
                <Icon size={20} />
              </div>

              <div>
                <strong>{step.title}</strong>
                <p className="muted small">{step.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
