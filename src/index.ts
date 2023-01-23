type ShareType = 'mixed' | 'boys' | 'girls';

interface IFormData {
  name: string;
  email: string;
  interests: string[];
  share: boolean;
  pillow: boolean;
  sleepingBag: boolean;
  sleepingMat: boolean;
  age?: number;
  shareType?: ShareType;
}

const interestInputElement = document.getElementById(
  'interest',
) as HTMLInputElement;

interestInputElement.onkeydown = function (e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    addInterest();
  }
};

function isNumber(value: string) {
  return !isNaN(+value);
}

let interests: string[] = [];
function renderInterests() {
  const interestsElement = document.getElementById(
    'interests',
  ) as HTMLUListElement;

  if (!interestsElement) {
    return;
  }

  interestsElement.innerHTML = '';

  interests.map((interest) => {
    const el = document.createElement('li');
    el.innerHTML = `
      <span>${interest}</span>
      <span class="interest-badge__remove">
        <span class="interest-badge__remove__icon">
          <svg class="oo sl du" viewBox="0 0 16 16">
            <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z"></path>
          </svg>
        </span>
      </span>
    `;
    el.classList.add('interest-badge', 'interest-badge--close');
    el.onclick = () => removeInterest(interest);
    interestsElement.appendChild(el);
  });
}

function addInterest() {
  const interestsErrorElement = document.getElementById('interests-error');
  if (!interestInputElement || !interestInputElement.value) {
    return;
  }

  if (interestsErrorElement?.classList.contains('show')) {
    interestsErrorElement.classList.remove('show');
  }

  interests.push(interestInputElement.value);
  renderInterests();
  interestInputElement.value = '';
}

function removeInterest(interest: string) {
  const interestsErrorElement = document.getElementById('interests-error');
  interests = [...interests.filter((i) => i !== interest)];

  if (
    interests.length === 0 &&
    !interestsErrorElement?.classList.contains('show')
  ) {
    interestsErrorElement?.classList.add('show');
  }

  renderInterests();
}

function toggleShareType(visible: boolean) {
  const shareTypeElement = document.getElementById('share-type');

  if (visible) {
    shareTypeElement?.classList.remove('hide');
  } else {
    shareTypeElement?.classList.add('hide');
  }
}

async function onFormSubmit(event: SubmitEvent, form: HTMLFormElement) {
  event.preventDefault();

  if (interests.length === 0) {
    const interestsErrorElement = document.getElementById('interests-error');
    interestsErrorElement?.classList.add('show');
    return;
  }

  const formData: { [key: string]: FormDataEntryValue } = {};
  const data = new FormData(form);
  const pairs = Array.from(data.entries());
  for (const pair of pairs) {
    formData[pair[0]] = pair[1];
  }

  const payload: IFormData = {
    name: formData['name'] as string,
    email: formData['email'] as string,
    age:
      typeof formData['age'] === 'string' && isNumber(formData['age'])
        ? parseInt(formData['age'])
        : undefined,
    interests,
    share: formData['share'] === 'true',
    pillow: formData['pillow'] === 'on' ? true : false,
    sleepingBag: formData['sleepingBag'] === 'on' ? true : false,
    sleepingMat: formData['sleepingMat'] === 'on' ? true : false,
  };

  if (payload.share) {
    payload.shareType = formData['shareType'] as ShareType;
  }

  // simulate request
  form.childNodes.forEach((c) => ((c as HTMLFieldSetElement).disabled = true));
  await new Promise((r) => setTimeout(r, 2000));
  form.childNodes.forEach((c) => ((c as HTMLFieldSetElement).disabled = false));

  renderSuccess(payload);
}

const form = document.querySelector('form');
if (form) {
  form.onsubmit = (event) => onFormSubmit(event, form);
}

function toggleSuccess() {
  const signupSuccessElement = document.getElementById('signup-success');
  const signupElement = document.getElementById('signup');
  signupSuccessElement?.classList.toggle('hide');
  signupElement?.classList.toggle('hide');
}

function translateShareType(shareType: ShareType) {
  switch (shareType) {
    case 'boys':
      return 'Killar';
    case 'girls':
      return 'Tjejer';
    case 'mixed':
      return 'Tjejer och Killar';
  }
}

function renderSuccess(data: IFormData) {
  toggleSuccess();
  const interestsElement = document.getElementById('interests');
  const signupSuccessInformationElement = document.getElementById(
    'signup-success-information',
  ) as HTMLUListElement;
  if (!signupSuccessInformationElement) {
    return;
  }

  form?.reset();
  interests = [];
  toggleShareType(false);
  if (interestsElement) {
    interestsElement.innerHTML = '';
  }

  const markup = `
    <li class="">
      <p class="signup-success__label">Namn</p>
      <p>${data.name}</p>
    </li>
    <li>
      <p class="signup-success__label">E-post</p>
      <p>${data.email}</p>
    </li>
    ${
      data.age
        ? `
    <li>
      <p class="signup-success__label">Ålder</p>
      <p>${data.age}</p>
    </li>
    `
        : ''
    }
    <li>
      <p class="signup-success__label">Intressen</p>
      <ul>${data.interests
        .map(
          (interest) => `<li class="interest-badge">
          <span>${interest}</span>
        </li>`,
        )
        .join('')}
      </ul>
    </li>
    <li>
      <p class="signup-success__label">Boende</p>
      <p>Dela rum? <strong>${data.share ? 'Ja' : 'Nej'}</strong></p>
      ${
        data.share
          ? `<p>Typ av rum <strong>${translateShareType(
              data.shareType as ShareType,
            )}</strong></p>`
          : ''
      }
    </li>
    <li>
      <p class="signup-success__label">Jag kan ta med</p>
      <p>Sovsäck <strong>${data.sleepingBag ? 'Ja' : 'Nej'}</strong></p>
      <p>Kudde <strong>${data.pillow ? 'Ja' : 'Nej'}</strong></p>
      <p>Liggunderlag <strong>${data.sleepingMat ? 'Ja' : 'Nej'}</strong></p>
    </li>
  `;

  signupSuccessInformationElement.innerHTML = markup;
}

function closeSuccess() {
  toggleSuccess();
  window.scrollTo(0, 0);
}
